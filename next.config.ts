/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "nityagro.globaltech.com.np",
    "localhost:3000",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nityagro.globaltech.com.np",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "nityagro.globaltech.com.np",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
