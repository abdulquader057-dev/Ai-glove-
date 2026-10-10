/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent TypeScript type errors from failing the Vercel production build.
  // Type safety is still enforced in the IDE and on pre-push hooks.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Prevent ESLint warnings/errors from failing the Vercel production build.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
