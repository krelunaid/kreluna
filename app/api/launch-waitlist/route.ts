import { getLaunchStore } from '../../../db';

export async function POST(request: Request) {
  const headers = {'Cache-Control':'no-store'};
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({error:'origin'}, {status:403,headers});
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'content_type'}, {status:415,headers});
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  if (reader) {
    try {
      while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 2048) { await reader.cancel(); return Response.json({error:'too_large'},{status:413,headers}); }
        chunks.push(value);
      }
    } catch { return Response.json({error:'invalid'},{status:400,headers}); }
    finally { reader.releaseLock(); }
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength; }
  const body = new TextDecoder().decode(bytes);
  let data;
  try { data = JSON.parse(body); } catch { return Response.json({error:'invalid'}, {status:400,headers}); }
  if (!data || typeof data !== 'object') return Response.json({error:'invalid'}, {status:400,headers});
  if (data.website) return Response.json({ok:true},{status:201,headers});
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!['citybeam','velvet-table'].includes(data.project) || !['it','en','fr','es','de'].includes(data.locale) || data.consent !== true || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:'invalid'}, {status:400,headers});
  try {
    await getLaunchStore().prepare('INSERT INTO app_launch_waitlist (project,email,locale,consent_version) VALUES (?,?,?,?) ON CONFLICT(project,email) DO NOTHING').bind(data.project,email,data.locale,'2026-09-06').run();
    return Response.json({ok:true},{status:201,headers});
  } catch {
    console.error('Launch waitlist storage failed');
    return Response.json({error:'unavailable'},{status:503,headers});
  }
}
