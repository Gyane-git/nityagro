/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "nityagro.com",
    "www.nityagro.com",
    "localhost:3000",
    "nityagro.globaltech.com.np",
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
      {
        protocol: "https",
        hostname: "nityagro.globaltech.com.np",
        pathname: "/**",
      },
        {
        protocol: "https",
        hostname: "www.nityagro.globaltech.com.np",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;
