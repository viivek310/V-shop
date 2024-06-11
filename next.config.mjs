/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com','avatars.githubusercontent.com','lh3.googleusercontent.com'],
    },
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
  
      return config;
    },
}

export default nextConfig;
