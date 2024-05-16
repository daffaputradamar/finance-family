import pwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

const withPWA = pwa({
    dest: "public", // Destination directory for the PWA files
    register: true, // Register the PWA service worker
    skipWaiting: true, // Skip waiting for service worker activation
});

export default withPWA(nextConfig);
