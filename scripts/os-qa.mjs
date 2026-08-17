import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  const body = (await page.locator("body").innerText()).slice(0, 600);
  console.log("TEXT", body.replace(/\s+/g, " "));
  await page.screenshot({ path: "/workspace/screenshots/luna-format.png" });

  const pkgs = page.getByRole("button", { name: "Pacchetti" });
  if (await pkgs.count()) {
    await pkgs.first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "/workspace/screenshots/luna-packages.png" });
    await page.getByText("kreluna.core", { exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "/workspace/screenshots/luna-inspect.png" });
  }
} finally {
  await browser.close();
}

if (errors.length) {
  console.log("ERRORS");
  for (const e of errors) console.log(e);
  process.exit(2);
}
console.log("ok");
