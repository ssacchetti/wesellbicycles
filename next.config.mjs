/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Next 16 only accepts listed qualities (default [75]) – anything else is
    // coerced. The greyscale/ghosted photos deliberately use lower ones.
    qualities: [40, 50, 60, 70, 75],
  },
};

export default nextConfig;
