/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  // Performance optimizations
  experimental: {
    // appDir: true,
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-avatar'],
  },

  // Compiler optimizations
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
};

export default nextConfig;
