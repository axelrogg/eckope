import createMDX from "@next/mdx";
import type { NextConfig } from "next";

import "./env-config";

const nextConfig: NextConfig = {
    pageExtensions: ["md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
