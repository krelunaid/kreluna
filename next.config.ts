import type { NextConfig } from "next";
import { readFileSync } from "node:fs";

const isArubaExport = process.env.KRELUNA_ARUBA_EXPORT === "1";
const arubaBasePath = process.env.KRELUNA_ARUBA_BASE_PATH ?? "";

const nextConfig: NextConfig = isArubaExport
  ? {
      output: "export",
      assetPrefix: arubaBasePath,
      trailingSlash: false,
    }
  : {
      async redirects() {
        return [
          ...readFileSync(new URL("./public/_redirects", import.meta.url), "utf8")
            .split("\n")
            .filter((line) => line.startsWith("/") && line.endsWith(" 301"))
            .map((line) => {
              const [source, destination] = line.split(/\s+/);
              return { source, destination, permanent: true };
            }),
          {
            source: "/velvet-table/restaurants",
            destination: "/en/velvet-table/restaurants",
            permanent: true,
          },
          {
            source: "/velvet-table/restaurants/founding-100",
            destination: "/en/velvet-table/restaurants/founding-100",
            permanent: true,
          },
          {
            source: "/:locale(fr|es|de)/velvet-table/restaurants",
            destination: "/en/velvet-table/restaurants",
            permanent: true,
          },
          {
            source: "/:locale(fr|es|de)/velvet-table/restaurants/founding-100",
            destination: "/en/velvet-table/restaurants/founding-100",
            permanent: true,
          },
        ];
      },
    };

export default nextConfig;
