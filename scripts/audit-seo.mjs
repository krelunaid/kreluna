import assert from 'node:assert/strict';
const publicOrigin = 'https://www.kreluna.it';
const target = process.argv[2] || publicOrigin;
const resolve = u => u.replace(publicOrigin, target);
const norm = u => new URL(u).href.replace(/\/$/, '');
const xml = await (await fetch(`${target}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.ok(urls.length >= 48, 'Sitemap is missing pages');
const rows = [];
const errors = [];
function attrs(tag) {return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));}
for (const url of urls) {
  try {
    const r = await fetch(resolve(url), {redirect:'manual'});
    assert.equal(r.status,200,`HTTP ${r.status}`);
    assert.ok(!/noindex/i.test(r.headers.get('x-robots-tag')||''),'X-Robots-Tag blocks indexing');
    const html = await r.text();
    const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>attrs(m[0]));
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m=>attrs(m[0]));
    const canonical = links.filter(x=>x.rel==='canonical');
    assert.equal(canonical.length,1,'Canonical count');
    assert.equal(norm(canonical[0].href),norm(url),'Canonical mismatch');
    assert.equal([...html.matchAll(/<h1\b/gi)].length,1,'H1 count');
    const titles=[...html.matchAll(/<title>([^<]+)<\/title>/gi)];
    assert.equal(titles.length,1,'Title count');
    assert.ok(metas.some(x=>x.name==='description'&&x.content?.length>20),'Missing description');
    assert.ok(!metas.some(x=>['robots','googlebot'].includes(x.name)&&/noindex/i.test(x.content)),'Noindex');
    const ld=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(ld.length,'Missing JSON-LD');ld.forEach(m=>JSON.parse(m[1]));
    rows.push({url,title:titles[0][1],alternates:links.filter(x=>x.hreflang)});
  } catch(e) {errors.push(`${url}: ${e.message}`);}
}
for(const row of rows) for(const alt of row.alternates) {
  const other=rows.find(r=>norm(r.url)===norm(alt.href));
  if(!other) errors.push(`${row.url}: alternate absent from sitemap ${alt.href}`);
  else if(!other.alternates.some(a=>norm(a.href)===norm(row.url))) errors.push(`${row.url}: alternate not reciprocal ${alt.href}`);
}
assert.equal(new Set(rows.map(r=>r.title)).size,rows.length,'Duplicate titles');
console.log(JSON.stringify({target,pages:urls.length,passed:rows.length,errors},null,2));
if(errors.length) process.exitCode=1;
