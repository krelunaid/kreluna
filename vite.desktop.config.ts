import { rm } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const UNUSED_DESKTOP_ASSETS = [
  "og.jpg",
  "os/desktop-kreluna.png",
  "os/icon-180.png",
  "os/install.css",
  "os/kreluna-presentazione.mp4",
  "os/lock-portrait.jpg",
  "os/manifest.webmanifest",
  "os/nav-src.jpg",
  "os/nav.jpg",
];

function pruneDesktopAssets(): Plugin {
  return {
    name: "kreluna:prune-desktop-assets",
    apply: "build",
    async closeBundle() {
      await Promise.all(
        UNUSED_DESKTOP_ASSETS.map((asset) =>
          rm(fromRoot(`./dist-desktop/${asset}`), { force: true }),
        ),
      );
    },
  };
}

export default defineConfig({
  root: fromRoot("./desktop"),
  base: "./",
  publicDir: fromRoot("./public"),
  resolve: {
    alias: [
      { find: "@/lib/os/ai", replacement: fromRoot("./src/desktop/ai.ts") },
      { find: "@/lib/auth/gates", replacement: fromRoot("./src/desktop/auth-gates.tsx") },
      {
        find: "@/lib/auth/use-current-user",
        replacement: fromRoot("./src/desktop/use-current-user.ts"),
      },
      { find: "@", replacement: fromRoot("./src") },
    ],
  },
  plugins: [pruneDesktopAssets(), tailwindcss(), viteReact()],
  server: {
    host: "127.0.0.1",
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  build: {
    outDir: fromRoot("./dist-desktop"),
    emptyOutDir: true,
    target: "es2021",
  },
});
