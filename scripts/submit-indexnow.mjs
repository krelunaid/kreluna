import { readFile } from "node:fs/promises";

const siteOrigin = "https://www.kreluna.it";
const sitemapUrl = `${siteOrigin}/sitemap.xml`;
const endpoint = "https://api.indexnow.org/indexnow";

const configuration = JSON.parse(
  await readFile(new URL("../public/indexnow-urls.json", import.meta.url), "utf8"),
);

const sitemapResponse = await fetch(sitemapUrl, {
  headers: { "user-agent": "Kreluna-IndexNow/1.0" },
});

if (!sitemapResponse.ok) {
  throw new Error(`Unable to read the live sitemap (${sitemapResponse.status}).`);
}

const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1].trim())
  .filter((url) => new URL(url).origin === siteOrigin);
const urlList = [...new Set(urls)];

if (urlList.length === 0 || urlList.length > 10_000) {
  throw new Error(`Refusing to submit an unexpected URL count (${urlList.length}).`);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: configuration.host,
    key: configuration.key,
    keyLocation: configuration.keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow rejected the submission (${response.status}): ${body}`);
}

console.log(`IndexNow accepted ${urlList.length} live URLs (${response.status}).`);
