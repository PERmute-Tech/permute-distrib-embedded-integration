// Validate environment variables at startup (see src/env.mjs).
await import('./src/env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  devIndicators: { position: 'bottom-right' },
  output: 'standalone',
  reactStrictMode: true,
  compress: true,
};

export default config;
