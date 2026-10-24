
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "authjs.dev",
        pathname: "/img/providers/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.checkers.co.za",
        pathname: "/qr/**",
      },

        {
        protocol: "https",
        hostname: "www.catalog.sixty60.co.za",
        pathname: "/v2/files/**",
      },
      {
        protocol: "https",
        hostname: "catalog.sixty60.co.za",
        pathname: "/v2/files/**",
      },

        {
        protocol: "https",
        hostname: "cdn-prd-02.pnp.co.za",
        pathname: "/sys-master/images/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

export default nextConfig;


