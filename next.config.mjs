

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
      serverActions: {
          bodySizeLimit: "100000mb",
        },
  },
  images: {
      domains: ["drive.google.com", "lh3.googleusercontent.com", "res.cloudinary.com"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "drive.google.com",
          pathname: "/file/**",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
          pathname: "/**",
        },
      ],
    },
};

export default nextConfig;