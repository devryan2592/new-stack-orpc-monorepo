/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@workspace/ui", "@modules/feature-auth"],
  images: {
    domains: ["unsplash.com", "images.unsplash.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
