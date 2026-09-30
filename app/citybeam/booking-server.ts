import { env } from 'cloudflare:workers';
import { getLaunchStore } from '../../db';
import { getChatGPTUser } from '../chatgpt-auth';
import { verifyStripeSignature } from '../risonix/stripe-signature';

export const now = () => Math.floor(Date.now() / 1000);
export function setting(key: string) { const v = (env as unknown as Record<string, unknown>)[key] ?? process.env[key]; return typeof v === 'string' ? v.trim() : ''; }
export function fail(status: number, error: string): never { throw Object.assign(new Error(error), { status }); }
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: privateHeaders });
export function errorResponse(e: unknown) { const x = e as { status?: number; message?: string }; if (!x.status) console.error('CityBeam booking operation failed'); return json({ error: x.status ? x.message : 'unavailable' }, x.status || 503); }
export function sameOrigin(r: Request) { if (r.headers.get('origin') !== new URL(r.url).origin) fail(403, 'origin'); }
export async function body(r: Request, limit = 16384) {
  const reader = r.body?.getReader(); if (!reader) fail(400, 'invalid');
  const chunks: Uint8Array[] = []; let size = 0;
  try { while (true) { const v = await reader.read(); if (v.done) break; size += v.value.length; if (size > limit) { await reader.cancel(); fail(413, 'too_large'); } chunks.push(v.value); } } finally { reader.releaseLock(); }
  const out = new Uint8Array(size); let pos = 0; for (const c of chunks) { out.set(c, pos); pos += c.length; } return out;
}
export async function input(r: Request): Promise<Record<string, unknown>> { if (!r.headers.get('content-type')?.includes('application/json')) fail(415, 'content_type'); try { const v = JSON.parse(new TextDecoder().decode(await body(r))); if (!v || typeof v !== 'object' || Array.isArray(v)) fail(400, 'invalid'); return v; } catch(e) { if ((e as {status?:number}).status) throw e; return fail(400, 'invalid'); } }
export function str(v: unknown, max = 2000) { if (typeof v !== 'string' || !v.trim() || v.trim().length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v)) fail(400, 'invalid'); return v.trim(); }
export async function hash(v: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))).map(x => x.toString(16).padStart(2, '0')).join(''); }
export function token() { return Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x => x.toString(16).padStart(2, '0')).join(''); }
export async function admin() {
  const user = await getChatGPTUser(); if (!user) fail(401, 'signin');
  const allowed = setting('CITYBEAM_ADMIN_EMAILS').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) fail(403, 'admin_unconfigured'); return user.userId;
}
export type Booking = { id: string; request_id: string; token_hash: string; token_expires: number; amount: number; currency: string; description: string; campaign_date: string; supplier_reference: string; terms: string; expires_at: number; status: string; accepted_at: number | null; checkout_started: number | null; stripe_session: string | null; stripe_url: string | null; payment_intent: string | null; paid_at: number | null; campaign_reference: string | null; email: string; name: string; locale: string };
export async function find(id: string) { const b = await getLaunchStore().prepare('SELECT b.*, r.email, r.name, r.locale FROM citybeam_bookings b JOIN citybeam_requests r ON r.id=b.request_id WHERE b.id=?').bind(id).first<Booking>(); if (!b) fail(404, 'not_found'); return b; }
export async function client(r: Request) {
  const t = r.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1]; if (!t) fail(401, 'link_required');
  const row = await getLaunchStore().prepare('SELECT id FROM citybeam_bookings WHERE token_hash=? AND token_expires>?').bind(await hash(t), now()).first<{id:string}>(); if (!row) fail(401, 'link_expired'); return find(row.id);
}
export async function event(id: string, kind: string, actor: string) { await getLaunchStore().prepare('INSERT INTO citybeam_booking_events(id,booking_id,kind,actor,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),id,kind,actor,now()).run(); }
export function paymentsReady() { const key = setting('CITYBEAM_STRIPE_SECRET_KEY'); return setting('CITYBEAM_PAYMENTS_ENABLED') === 'true' && /^sk_live_|^rk_live_/.test(key) && !!setting('CITYBEAM_STRIPE_WEBHOOK_SECRET'); }
async function stripe(path: string, fields?: URLSearchParams, idem?: string): Promise<Record<string, any>> {
  if (!paymentsReady()) fail(503, 'payments_unavailable');
  const response = await fetch(`https://api.stripe.com/v1/${path}`, { method: fields ? 'POST' : 'GET', headers: { Authorization: `Bearer ${setting('CITYBEAM_STRIPE_SECRET_KEY')}`, ...(fields ? {'Content-Type':'application/x-www-form-urlencoded'} : {}), ...(idem ? {'Idempotency-Key':idem} : {}) }, body: fields, signal: AbortSignal.timeout(15000) });
  if (!response.ok) fail(502, 'payment_provider'); return response.json();
}
export async function publicBooking(b: Booking) {
  const files = await getLaunchStore().prepare("SELECT id,name,mime,size,created_at FROM citybeam_materials WHERE booking_id=? AND upload_status='ready' ORDER BY created_at DESC").bind(b.id).all();
  return { id:b.id, reference:`CB-${b.request_id.slice(0,8).toUpperCase()}`, amount:b.amount, currency:b.currency, description:b.description, campaignDate:b.campaign_date, terms:b.terms, expiresAt:b.expires_at, status:b.status, campaignReference:b.campaign_reference, files:files.results, paymentsReady:paymentsReady(), expired:b.expires_at<=now(), acceptedAt:b.accepted_at };
}
export async function checkout(b: Booking, accepted: unknown) {
  if (accepted !== true) fail(400, 'accept_terms');
  if (!paymentsReady()) fail(503, 'payments_unavailable');
  if (b.status !== 'quoted' || b.expires_at <= now()+1800) fail(409, 'quote_unavailable');
  if (b.stripe_session) { const s = await stripe(`checkout/sessions/${encodeURIComponent(b.stripe_session)}`); if (s.status !== 'open' || typeof s.url !== 'string') fail(409, 'quote_unavailable'); return s.url; }
  // A stable claim and provider key make retry after a timeout safe, including concurrent requests.
  await getLaunchStore().prepare('UPDATE citybeam_bookings SET checkout_started=COALESCE(checkout_started,?),accepted_at=COALESCE(accepted_at,?),updated_at=? WHERE id=? AND status=?').bind(now(),now(),now(),b.id,'quoted').run();
  b = await find(b.id);
  if (!b.checkout_started || now()-b.checkout_started>1800) fail(409, 'quote_unavailable');
  const fields = new URLSearchParams({ mode:'payment', customer_email:b.email, client_reference_id:b.id, locale:b.locale, 'payment_method_types[0]':'card', 'line_items[0][price_data][currency]':b.currency, 'line_items[0][price_data][unit_amount]':String(b.amount), 'line_items[0][price_data][product_data][name]':'CityBeam — NY-D020', 'line_items[0][quantity]':'1', 'metadata[citybeam_booking_id]':b.id, 'payment_intent_data[metadata][citybeam_booking_id]':b.id, success_url:`https://www.kreluna.it/citybeam/pratica?lang=${b.locale}`, cancel_url:`https://www.kreluna.it/citybeam/pratica?lang=${b.locale}`, expires_at:String(Math.min(b.expires_at,b.checkout_started+86400)), billing_address_collection:'required' });
  const s = await stripe('checkout/sessions', fields, `citybeam-${b.id}`);
  if (typeof s.id !== 'string' || typeof s.url !== 'string' || !s.url.startsWith('https://checkout.stripe.com/')) fail(502,'payment_provider');
  await getLaunchStore().prepare('UPDATE citybeam_bookings SET stripe_session=?,stripe_url=?,updated_at=? WHERE id=? AND status=? AND (stripe_session IS NULL OR stripe_session=?)').bind(s.id,s.url,now(),b.id,'quoted',s.id).run();
  return s.url as string;
}
export async function reconcile(b: Booking) {
  if (!b.stripe_session || !paymentsReady()) return b;
  const s = await stripe(`checkout/sessions/${encodeURIComponent(b.stripe_session)}`);
  if (s.id !== b.stripe_session || s.client_reference_id !== b.id || s.metadata?.citybeam_booking_id !== b.id || s.amount_total !== b.amount || s.currency !== b.currency || s.livemode !== true) fail(409,'payment_mismatch');
  if (s.payment_status === 'paid' && s.status === 'complete' && typeof s.payment_intent === 'string') {
    await getLaunchStore().prepare("UPDATE citybeam_bookings SET status='paid',payment_intent=?,paid_at=?,updated_at=? WHERE id=? AND status='quoted'").bind(s.payment_intent,now(),now(),b.id).run();
  }
  return find(b.id);
}
export async function webhook(r: Request) {
  const secret = setting('CITYBEAM_STRIPE_WEBHOOK_SECRET'); if (!secret) fail(503,'unconfigured');
  const raw = new TextDecoder().decode(await body(r,262144));
  if (!await verifyStripeSignature(raw,r.headers.get('stripe-signature') || '',secret)) fail(400,'signature');
  const e = JSON.parse(raw); if (e.livemode !== true) fail(400,'mode');
  if (e.type === 'checkout.session.completed' || e.type === 'checkout.session.async_payment_succeeded') {
    const s = e.data?.object; const id = s?.metadata?.citybeam_booking_id; if (typeof id !== 'string') return json({received:true});
    const b = await find(id); if (!b.stripe_session) fail(503,'retry'); if (b.stripe_session !== s.id) fail(400,'payment_mismatch'); await reconcile(b);
  }
  if (e.type === 'charge.refunded' || e.type === 'charge.dispute.created') {
    const object = e.data?.object;
    const intent = object?.payment_intent;
    if (typeof intent === 'string') {
      const status = e.type === 'charge.refunded' && object.refunded === true ? 'refunded' : 'payment_review';
      await getLaunchStore().prepare('UPDATE citybeam_bookings SET status=?,updated_at=? WHERE payment_intent=? AND status != ?').bind(status,now(),intent,'refunded').run();
    }
  }
  return json({received:true});
}
type Bucket = {put(key:string, value:Uint8Array, options:unknown):Promise<unknown>; get(key:string):Promise<{body:ReadableStream}|null>; delete(key:string):Promise<void>};
function bucket() { const b = (env as unknown as {FILES?:Bucket}).FILES; if (!b) fail(503,'storage_unavailable'); return b; }
export async function upload(r: Request, b: Booking) {
  if (r.headers.get('x-material-rights') !== 'confirmed') fail(400,'rights_required');
  if (!['paid','materials_received'].includes(b.status)) fail(409,'upload_unavailable');
  const bytes = await body(r,25*1024*1024); if (!bytes.length) fail(400,'invalid_file');
  const mime = r.headers.get('content-type')?.split(';')[0] || '';
  const isJpeg = mime==='image/jpeg' && bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  const isPng = mime==='image/png' && [137,80,78,71,13,10,26,10].every((x,i)=>bytes[i]===x);
  const isWebp = mime==='image/webp' && new TextDecoder().decode(bytes.slice(0,4))==='RIFF' && new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
  const isMp4 = mime==='video/mp4' && new TextDecoder().decode(bytes.slice(4,8))==='ftyp';
  if (!(isJpeg || isPng || isWebp || isMp4)) fail(400,'invalid_file');
  const name = decodeURIComponent(r.headers.get('x-file-name') || 'material').replace(/[^\p{L}\p{N} ._()-]/gu,'_').slice(0,120);
  const id = crypto.randomUUID(); const key = `citybeam/${b.id}/${id}`;
  // Reserve a slot atomically before writing bytes; avoid concurrent quota bypass.
  const saved = await getLaunchStore().prepare('INSERT INTO citybeam_materials(id,booking_id,object_key,name,mime,size,created_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM citybeam_materials WHERE booking_id=?)<5 AND EXISTS(SELECT 1 FROM citybeam_bookings WHERE id=? AND status IN (?,?))').bind(id,b.id,key,name,mime,bytes.length,now(),b.id,b.id,'paid','materials_received').run();
  if (!saved.meta.changes) fail(409,'file_limit');
  try { await bucket().put(key,bytes,{httpMetadata:{contentType:mime}}); } catch(e) { await getLaunchStore().prepare('DELETE FROM citybeam_materials WHERE id=?').bind(id).run(); throw e; }
  await getLaunchStore().prepare("UPDATE citybeam_materials SET upload_status='ready' WHERE id=?").bind(id).run();
  await getLaunchStore().prepare("UPDATE citybeam_bookings SET status='materials_received',updated_at=? WHERE id=? AND status='paid'").bind(now(),b.id).run();
  return json({ok:true});
}
export async function file(id: string, bookingId?: string) {
  const f = await getLaunchStore().prepare("SELECT object_key,name,mime FROM citybeam_materials WHERE id=? AND upload_status='ready' AND (? IS NULL OR booking_id=?)").bind(id,bookingId || null,bookingId || null).first<{object_key:string;name:string;mime:string}>(); if (!f) fail(404,'not_found');
  const obj = await bucket().get(f.object_key); if (!obj) fail(404,'not_found');
  return new Response(obj.body,{headers:{...privateHeaders,'Content-Type':f.mime,'Content-Disposition':`attachment; filename="material"; filename*=UTF-8''${encodeURIComponent(f.name)}`}});
}
