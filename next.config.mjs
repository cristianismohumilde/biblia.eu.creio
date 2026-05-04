/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // BasePath removed to support custom domain biblia.creio.eu
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
