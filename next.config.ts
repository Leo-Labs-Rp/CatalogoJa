import type { NextConfig } from "next";

function getSupabaseImagePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return [];

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return [];

    return [{
      hostname: url.hostname,
      pathname: "/storage/v1/object/public/**",
      port: url.port,
      protocol: url.protocol === "http:" ? "http" as const : "https" as const,
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getSupabaseImagePattern(),
  },
};

export default nextConfig;
