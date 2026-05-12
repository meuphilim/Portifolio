/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? 'standalone' : 'export',
  
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  basePath: process.env.NODE_ENV === 'production' ? '/Portifolio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Portifolio/' : '',
  
  images: {
    unoptimized: true,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;