import { getLaunchStore } from '../../../../../db';
import { admin, body, checkout, client, errorResponse, event, fail, file, find, hash, input, json, now, paymentsReady, publicBooking, reconcile, sameOrigin, str, token, upload } from '../../../../citybeam/booking-server';

export const dynamic = 'force-dynamic';
async function route(r: Request) {
  const path = new URL(r.url).pathname.split('/booking/')[1]?.split('/') || [];
  try {
    if (r.method !== 'GET') sameOrigin(r);
    if (path[0] === 'admin') {
      const actor = await admin();
      if (r.method === 'GET' && path[1] === 'requests') {
        const list = await getLaunchStore().prepare('SELECT r.*,b.id AS booking_id,b.status AS booking_status,b.amount,b.currency FROM citybeam_requests r LEFT JOIN citybeam_bookings b ON b.request_id=r.id ORDER BY r.created_at DESC LIMIT 200').all();
        return json({requests:list.results,paymentsReady:paymentsReady()});
      }
      if (r.method === 'GET' && path[1] === 'file') return file(path[2]);
      if (r.method === 'GET' && path[1] === 'detail') {
        const b = await find(path[2]); const history = await getLaunchStore().prepare('SELECT kind,created_at FROM citybeam_booking_events WHERE booking_id=? ORDER BY created_at DESC').bind(b.id).all();
        return json({...await publicBooking(b),supplierReference:b.supplier_reference,history:history.results});
      }
      if (r.method === 'POST' && path[1] === 'quote') {
        const d = await input(r); const requestId = str(d.requestId,36);
        const amount = Number(d.amount); const currency = str(d.currency,3).toLowerCase();
        const expires = Number(d.expiresAt); const date = str(d.campaignDate,10);
        if (!Number.isSafeInteger(amount) || amount < 100 || amount > 10000000 || !['usd','eur'].includes(currency) || !Number.isInteger(expires) || expires < now()+3600 || expires>now()+30*86400 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date || Date.parse(date)<Date.now() || expires>Date.parse(date)/1000 || d.availabilityConfirmed!==true || d.totalConfirmed!==true) fail(400,'invalid_quote');
        const request = await getLaunchStore().prepare('SELECT locale FROM citybeam_requests WHERE id=?').bind(requestId).first<{locale:string}>(); if (!request) fail(404,'not_found');
        const id=crypto.randomUUID(), t=token();
        const inserted=await getLaunchStore().prepare('INSERT INTO citybeam_bookings(id,request_id,token_hash,token_expires,amount,currency,description,campaign_date,supplier_reference,terms,expires_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_id) DO NOTHING').bind(id,requestId,await hash(t),now()+180*86400,amount,currency,str(d.description,1800),date,str(d.supplierReference,500),str(d.terms,6000),expires,'quoted',now(),now()).run();
        if (!inserted.meta.changes) fail(409,'quote_exists');
        await event(id,'quote_created',actor);
        return json({id,url:`https://www.kreluna.it/citybeam/pratica?lang=${request.locale}#access=${t}`},201);
      }
      if (r.method === 'POST' && path[1] === 'link') {
        const d = await input(r); const b=await find(str(d.id,36)); const t=token();
        await getLaunchStore().prepare('UPDATE citybeam_bookings SET token_hash=?,token_expires=?,updated_at=? WHERE id=?').bind(await hash(t),now()+180*86400,now(),b.id).run();
        await event(b.id,'access_link_rotated',actor);
        return json({url:`https://www.kreluna.it/citybeam/pratica?lang=${b.locale}#access=${t}`});
      }
      if (r.method === 'POST' && path[1] === 'status') {
        const d=await input(r); const b=await find(str(d.id,36)); const next=str(d.status,30); const ref=str(d.reference,500);
        const from = next==='confirmed' ? 'materials_received' : next==='completed' ? 'confirmed' : '';
        if (!from || b.status!==from) fail(409,'invalid_transition');
        const changed=await getLaunchStore().prepare('UPDATE citybeam_bookings SET status=?,campaign_reference=?,updated_at=? WHERE id=? AND status=?').bind(next,ref,now(),b.id,from).run();
        if (!changed.meta.changes) fail(409,'invalid_transition'); await event(b.id,next,actor); return json({ok:true});
      }
      fail(404,'not_found');
    }
    const b=await client(r);
    if (r.method==='GET' && path[0]==='detail') return json(await publicBooking(b));
    if (r.method==='GET' && path[0]==='file') return file(path[1],b.id);
    if (r.method==='POST' && path[0]==='checkout') {const d=await input(r); return json({url:await checkout(b,d.accepted)});}
    if (r.method==='POST' && path[0]==='refresh') return json(await publicBooking(await reconcile(b)));
    if (r.method==='POST' && path[0]==='upload') return upload(r,b);
    fail(404,'not_found');
  } catch(e) {return errorResponse(e);}
}
export const GET=route;
export const POST=route;
