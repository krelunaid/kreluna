import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('all CityBeam locales retain content, SEO and navigation without hydration', async () => {
  for (const locale of ['it', 'en', 'fr', 'es', 'de']) {
    const path = locale === 'it' ? '/citybeam' : `/${locale}/citybeam`;
    const html = await readFile(`public${path}.html`, 'utf8');
    assert.match(html, new RegExp(`<html lang="${locale}"`));
    assert.ok(html.includes(`rel="canonical" href="https://www.kreluna.it${path}"`));
    assert.equal((html.match(/<details>/g) || []).length, 5);
    assert.equal((html.match(/hreflang=/g) || []).length, 6);
    assert.ok(!html.includes('/_next/static'));
    assert.ok(!html.includes('vinext.navigationRuntime'));
    assert.match(html, /<script id="citybeam-consent">/);
    assert.ok(!html.includes('defer src="/assets/citybeam-consent.js"'));
    assert.match(html, /image\/avif/);
    assert.match(html, /id="cookie-banner"[^>]* hidden/);
    assert.match(html, /@media \(max-width: 700px\)/);
    assert.ok(html.includes(`aria-label="${locale === 'it' ? 'Home' : locale === 'en' ? 'Home' : locale === 'fr' ? 'Accueil' : locale === 'es' ? 'Inicio' : 'Startseite'}"`));
    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
  }
});

test('consent blocks Meta until acceptance; preferences persist and can be reopened', async () => {
  const callbacks = {}, stored = {}, requests = [];
  const banner = {hidden:true,addEventListener:(_,fn)=>callbacks.choose=fn};
  const settings = {hidden:false,focus(){},addEventListener:(_,fn)=>callbacks.open=fn};
  const context = {
    document:{getElementById:id=>id==='cookie-banner'?banner:settings,createElement:()=>({}),head:{appendChild:script=>requests.push(script.src)}},
    localStorage:{getItem:key=>stored[key],setItem:(key,value)=>stored[key]=value},
    location:{pathname:'/citybeam'},CustomEvent:class{},window:{dispatchEvent(){}},
  };
  vm.runInNewContext(await readFile('public/assets/citybeam-consent.js','utf8'),context);
  assert.equal(requests.length,0);
  assert.equal(banner.hidden,false);
  const choose = value=>callbacks.choose({target:{closest:()=>({dataset:{choice:value}})}});
  choose('technical');
  assert.equal(requests.length,0);
  assert.equal(stored['kreluna-cookie-choice'],'technical');
  callbacks.open();assert.equal(banner.hidden,false);
  choose('accepted');assert.equal(requests.length,1);
  callbacks.open();choose('accepted');assert.equal(requests.length,1);
  choose('technical');
  assert.equal(context.window.fbq.queue.at(-1)[1],'revoke');
});
