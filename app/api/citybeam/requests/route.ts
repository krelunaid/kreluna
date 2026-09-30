import { env } from 'cloudflare:workers';
import { getLaunchStore } from '../../../../db';

const headers = { 'Cache-Control': 'no-store' };
const reference = (id: string) => `CB-${id.slice(0, 8).toUpperCase()}`;
function setting(name: string): string {
  const value = (env as unknown as Record<string, unknown>)[name] ?? process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

// Notifications use Kreluna's existing, verified transactional email setup.
// The request is retained in D1 even when the provider is unavailable.
async function notifyOffice(id: string, data: Record<string, string>) {
  const key = setting('RISONIX_EMAIL_API_KEY');
  const from = setting('RISONIX_EMAIL_FROM');
  if (!key || !from || setting('RISONIX_EMAIL_PROVIDER') !== 'resend' || setting('RISONIX_EMAIL_API_URL') !== 'https://api.resend.com/emails') {
    return { status: 'not_configured', providerId: null };
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'Idempotency-Key': `citybeam-request-${id}` },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from, to: ['info@kreluna.it'], reply_to: data.email,
        subject: `CityBeam — nuova richiesta ${reference(id)}`,
        text: `Richiesta CityBeam ${reference(id)}\n\nNome: ${data.name}\nEmail: ${data.email}\nLingua: ${data.locale}\nFormula: ${data.format}\nData indicativa: ${data.date || 'Da definire'}\n\nIdea:\n${data.idea}\n\nTesto anteprima: ${data.previewMessage || 'Non allegato'}\nColore anteprima: ${data.previewTheme || 'Non selezionato'}\n\nLa richiesta è salvata nel database del sito, tabella citybeam_requests. Nessuna prenotazione o pagamento. Le immagini usate nel simulatore non vengono trasmesse.`,
      }),
    });
    if (!response.ok) return { status: 'failed', providerId: null };
    const result = await response.json() as { id?: string };
    if (typeof result.id !== 'string') return { status: 'failed', providerId: null };
    return { status: 'accepted', providerId: result.id };
  } catch { return { status: 'failed', providerId: null }; }
}

async function recordNotification(id: string, data: Record<string, string>) {
  const store = getLaunchStore();
  const now = Math.floor(Date.now() / 1000);
  try {
    // Claim a bounded retry. The same provider key deduplicates concurrent/uncertain sends.
    const claim = await store.prepare(`UPDATE citybeam_requests
      SET notification_attempts = notification_attempts + 1, notification_attempted_at = ?
      WHERE id = ? AND notification_status != 'accepted' AND notification_attempts < 3
      AND created_at > ? AND (notification_attempted_at IS NULL OR notification_attempted_at < ?)`)
      .bind(now, id, now - 82800, now - 30).run();
    if (!claim.meta.changes) return;
    const notification = await notifyOffice(id, data);
    await store.prepare('UPDATE citybeam_requests SET notification_status = ?, notification_id = ? WHERE id = ?')
      .bind(notification.status, notification.providerId, id).run();
  } catch { console.error('CityBeam notification status unavailable'); }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'origin' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'content_type' }, { status: 415, headers });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: 'invalid' }, { status: 400, headers });
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8192) { await reader.cancel(); return Response.json({ error: 'too_large' }, { status: 413, headers }); }
      chunks.push(value);
    }
  } catch { return Response.json({ error: 'invalid' }, { status: 400, headers }); }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let input: Record<string, unknown>;
  try {
    input = JSON.parse(new TextDecoder().decode(bytes));
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid');
  } catch { return Response.json({ error: 'invalid' }, { status: 400, headers }); }
  if (input.website) return Response.json({ error: 'invalid' }, { status: 400, headers });
  const field = (name: string) => typeof input[name] === 'string' ? (input[name] as string).trim() : '';
  const id = field('requestId');
  const data = {
    name: field('name'), email: field('email').toLowerCase(), locale: field('locale'), format: field('format'),
    date: field('date'), idea: field('idea'), previewMessage: field('previewMessage'), previewTheme: field('previewTheme'),
  };
  const dateValid = !data.date || (/^\d{4}-\d{2}-\d{2}$/.test(data.date) && Number.isFinite(Date.parse(data.date)) && new Date(data.date).toISOString().slice(0,10) === data.date);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id) || !data.name || data.name.length > 100 || /[\r\n\x00-\x1f]/.test(data.name) || data.email.length > 254 || /[\x00-\x1f\x7f]/.test(data.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !['it','en','fr','es','de'].includes(data.locale) || !['advice','daily','roadblock'].includes(data.format) || !dateValid || !data.idea || data.idea.length > 1200 || data.previewMessage.length > 60 || !['','lime','violet','ivory'].includes(data.previewTheme) || input.privacy !== true) {
    return Response.json({ error: 'invalid' }, { status: 400, headers });
  }
  const payloadHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(data))))).map(byte => byte.toString(16).padStart(2, '0')).join('');
  let store;
  try {
    store = getLaunchStore();
    const existing = await store.prepare('SELECT payload_hash FROM citybeam_requests WHERE id = ?').bind(id).first<{payload_hash: string}>();
    if (existing) {
      if (existing.payload_hash !== payloadHash) return Response.json({ error: 'conflict' }, { status: 409, headers });
      await recordNotification(id, data);
      return Response.json({ ok: true, reference: reference(id) }, { headers });
    }
    const now = Math.floor(Date.now() / 1000);
    const result = await store.prepare(`INSERT INTO citybeam_requests
      (id,payload_hash,name,email,locale,format,preferred_date,idea,preview_message,preview_theme,privacy_version,created_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?
      WHERE (SELECT COUNT(*) FROM citybeam_requests WHERE email = ? AND created_at > ?) < 5
      AND (SELECT COUNT(*) FROM citybeam_requests WHERE created_at > ?) < 100
      ON CONFLICT(id) DO NOTHING`).bind(id, payloadHash, data.name, data.email, data.locale, data.format, data.date || null, data.idea, data.previewMessage || null, data.previewTheme || null, '2026-09-30', now, data.email, now - 3600, now - 3600).run();
    if (!result.meta.changes) {
      const concurrent = await store.prepare('SELECT payload_hash FROM citybeam_requests WHERE id = ?').bind(id).first<{payload_hash: string}>();
      if (concurrent?.payload_hash === payloadHash) return Response.json({ ok: true, reference: reference(id) }, { headers });
      return Response.json({ error: 'rate_limit' }, { status: 429, headers: { ...headers, 'Retry-After': '3600' } });
    }
  } catch {
    console.error('CityBeam request storage unavailable');
    return Response.json({ error: 'unavailable' }, { status: 503, headers });
  }
  await recordNotification(id, data);
  return Response.json({ ok: true, reference: reference(id) }, { status: 201, headers });
}
