/** @type {import('next').NextConfig} */
const nextConfig = {
 webpack: (config, { isServer }) => {
  // Exclude extension directory from TypeScript compilation
  config.module.rules.push({
   test: /\.tsx?$/,
   exclude: /extension/,
  });
  return config;
 },
 env: {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
   process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
   process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
   process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 },
};
nextConfig.images = {
 remotePatterns: [
  {
   protocol: "https",
   hostname: "**",
  },
  {
   protocol: "http",
   hostname: "**",
  },
 ],
};
module.exports = nextConfig;
