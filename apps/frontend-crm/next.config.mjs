/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@shared/ui", "@workspace/feature-auth"],
  images: {
    domains: ["unsplash.com", "images.unsplash.com", "res.cloudinary.com"],
  },
}

export default nextConfig
