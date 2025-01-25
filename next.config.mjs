/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions: {
            bodySizeLimit: "100000mb",
          },
    },
    images: {
        domains: ["res.cloudinary.com"]
    }
};

export default nextConfig;
