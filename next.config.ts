/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "nityagro.com",
    "www.nityagro.com",
    "localhost:3000",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nityagro.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nityagro.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
