import type { NextConfig } from "next";

const isArubaExport = process.env.KRELUNA_ARUBA_EXPORT === "1";
const arubaBasePath = process.env.KRELUNA_ARUBA_BASE_PATH ?? "";

const nextConfig: NextConfig = isArubaExport
  ? {
      output: "export",
      assetPrefix: arubaBasePath,
      trailingSlash: false,
    }
  : {};

export default nextConfig;
