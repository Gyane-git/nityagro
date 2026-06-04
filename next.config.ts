/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    
    "nityagro.com",
    "localhost:3000",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://nityagro.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "nityagro.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
