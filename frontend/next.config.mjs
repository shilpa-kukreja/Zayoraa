/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/** @type {import('next').NextConfig['images']['remotePatterns']} */
const remotePatterns = [];

try {
  const parsed = new URL(backendUrl);
  remotePatterns.push({
    protocol: parsed.protocol.replace(":", ""),
    hostname: parsed.hostname,
    ...(parsed.port ? { port: parsed.port } : {}),
    pathname: "/uploads/**",
  });
} catch {
  // fallback for invalid env at build time
  remotePatterns.push({
    protocol: "http",
    hostname: "localhost",
    port: "5000",
    pathname: "/uploads/**",
  });
}

if (isDev) {
  for (const hostname of ["localhost", "127.0.0.1"]) {
    if (!remotePatterns.some((p) => p.hostname === hostname)) {
      remotePatterns.push({
        protocol: "http",
        hostname,
        port: "5000",
        pathname: "/uploads/**",
      });
    }
  }
}

const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns,
  },
};

export default nextConfig;
