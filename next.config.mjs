// next.config.mjs
// ---------------------------------------------------------------
// Next.js configuration. We're keeping this minimal for now.
// You'll add things here later: image domains, redirects, env vars, etc.
// ---------------------------------------------------------------

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch bugs during development (runs effects twice on purpose - don't be alarmed)

  // Marketplace was renamed to Shop — keep old links working
  async redirects() {
    return [
      { source: "/marketplace", destination: "/shop", permanent: true },
      { source: "/marketplace/:path*", destination: "/shop/:path*", permanent: true },
      // Only one game for now — send the games hub straight to it.
      // Temporary (307) so browsers don't cache it if the hub comes back.
      { source: "/games", destination: "/games/shadawi-striker", permanent: false },
      // One sign-in page handles both signing up and logging in — catch the addresses people type
      { source: "/login", destination: "/signup", permanent: false },
      { source: "/signin", destination: "/signup", permanent: false },
    ];
  },

  webpack(config) {
    // wagmi's connector barrel exports every connector, including experimental
    // ones we don't use. Stub out their missing peer deps so the build doesn't fail.
    // Connectors we DO use have their deps installed (walletConnect, coinbaseWallet).
    config.resolve.alias['porto/internal'] = false;      // Porto connector
    config.resolve.alias['accounts'] = false;            // Tempo connector
    config.resolve.alias['@metamask/connect-evm'] = false; // MetaMask SDK connector (we use injected instead)
    config.resolve.alias['@safe-global/safe-apps-sdk'] = false; // Safe connector
    return config;
  },
};

export default nextConfig;
