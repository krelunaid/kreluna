import { access, cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requestedOutput = process.argv[2];

if (!requestedOutput) {
  throw new Error("Pass a new output directory as the first argument.");
}

const outputDir = path.resolve(requestedOutput);

try {
  await access(outputDir);
  throw new Error(`Refusing to overwrite existing directory: ${outputDir}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const clientDir = path.join(projectDir, "dist/client");
const workerUrl = pathToFileURL(path.join(projectDir, "dist/server/index.js"));
workerUrl.searchParams.set("aruba-release", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

await mkdir(outputDir, { recursive: false });
await cp(clientDir, outputDir, {
  recursive: true,
  filter(source) {
    const relative = path.relative(clientDir, source);
    return ![
      ".assetsignore",
      "_headers",
      "vinext-client-entry-manifest.json",
      ".vite",
    ].some((entry) => relative === entry || relative.startsWith(`${entry}${path.sep}`));
  },
});

async function render(pathname, filename, accept = "text/html", extraHeaders = {}) {
  const response = await worker.fetch(
    new Request(`https://www.kreluna.it${pathname}`, {
      headers: { accept, ...extraHeaders },
    }),
    env,
    ctx,
  );
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  const destination = path.join(outputDir, filename);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

await render("/", "index.html");
await render("/?_rsc", "index.rsc", "text/x-component", { RSC: "1" });
await render("/robots.txt", "robots.txt", "text/plain");
await render("/sitemap.xml", "sitemap.xml", "application/xml");

const home = await readFile(path.join(outputDir, "index.html"), "utf8");
const staticLanding = await readFile(
  path.join(outputDir, "intelligenza-artificiale-aziende.html"),
  "utf8",
);
const sitemap = await readFile(path.join(outputDir, "sitemap.xml"), "utf8");
const requiredHomeMarkers = [
  /rel="canonical" href="https:\/\/www\.kreluna\.it\/"/i,
  /hrefLang="it" href="https:\/\/www\.kreluna\.it\/"/i,
  /hrefLang="en" href="https:\/\/www\.kreluna\.it\/en\/"/i,
  /hrefLang="x-default" href="https:\/\/www\.kreluna\.it\/"/i,
  /id="kreluna-structured-data"/i,
  /AI Act — testo ufficiale/i,
];
for (const marker of requiredHomeMarkers) {
  if (!marker.test(home)) throw new Error(`Missing homepage marker: ${marker}`);
}
if (!/\/assets\/seo-20260814\.css/i.test(staticLanding)) {
  throw new Error("The enhanced static-page stylesheet is not referenced.");
}
if ((sitemap.match(/<url>/g) ?? []).length !== 28) {
  throw new Error("The sitemap must contain exactly 28 URLs.");
}
if (/andreagadducci\.chatgpt\.site/i.test(home) || /andreagadducci\.chatgpt\.site/i.test(sitemap)) {
  throw new Error("Private preview hostname leaked into the Aruba release.");
}

console.log(outputDir);
