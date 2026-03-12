/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development"

const nextConfig = {
  output: isDev ? undefined : "export",
  pageExtensions: isDev
    ? ["tsx", "ts", "jsx", "js", "dev.ts", "dev.tsx"]
    : ["tsx", "ts", "jsx", "js"],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/docs-raw/:path*",
      },
    ]
  },
}

export default nextConfig
