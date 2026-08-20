import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

test("desktop package has a dedicated static build", () => {
  const pkg = JSON.parse(read("package.json"));
  const vite = read("vite.desktop.config.ts");

  assert.equal(pkg.name, "kreluna");
  assert.equal(pkg.version, "1.0.0");
  assert.match(pkg.scripts["desktop:build"], /vite build --config vite\.desktop\.config\.ts/);
  assert.match(vite, /dist-desktop/);
  assert.match(vite, /src\/desktop\/ai\.ts/);
  assert.match(vite, /src\/desktop\/auth-gates\.tsx/);
});

test("desktop package never embeds the online AI provider secret", () => {
  const desktopAi = read("src/desktop/ai.ts");

  assert.doesNotMatch(desktopAi, /XAI_API_KEY|api\.x\.ai/);
  assert.match(desktopAi, /desktop-local/);
});

test("Tauri package has a stable identity and a restricted CSP", () => {
  const config = JSON.parse(read("src-tauri/tauri.conf.json"));
  const capability = JSON.parse(read("src-tauri/capabilities/main.json"));

  assert.equal(config.productName, "Kreluna");
  assert.equal(config.version, "1.0.0");
  assert.equal(config.identifier, "com.kreluna.desktop");
  assert.equal(config.build.frontendDist, "../dist-desktop");
  assert.equal(config.app.security.csp["default-src"], "'self' customprotocol: asset:");
  assert.deepEqual(capability.permissions, ["core:default"]);
});

test("desktop product copy describes Luna as a runtime, not a kernel", () => {
  const settings = read("src/components/os/apps/SettingsApp.tsx");

  assert.match(settings, /Luna Runtime 1/);
  assert.doesNotMatch(settings, /Kernel mercoledì|Kernel on Wednesday/);
});
