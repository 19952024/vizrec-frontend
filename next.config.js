/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  // Proxy API to FastAPI backend when BACKEND_URL is set
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      const base = backendUrl.replace(/\/$/, "");
      return [
        { source: "/api/sentra-core", destination: `${base}/api/sentra-core` },
        { source: "/api/sentra-core/:path*", destination: `${base}/api/sentra-core/:path*` },
        { source: "/api/auth", destination: `${base}/api/auth` },
        { source: "/api/auth/:path*", destination: `${base}/api/auth/:path*` },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
