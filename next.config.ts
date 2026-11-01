import type { NextConfig } from "next";

if (
  process.env.NODE_ENV === "production" &&
  process.env.API_MOCKS_ENABLED === "true"
) {
  throw new Error("API mocks cannot be enabled in production.");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["bacurim.mamura.test"],
};

export default nextConfig;
