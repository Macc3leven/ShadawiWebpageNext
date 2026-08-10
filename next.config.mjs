// next.config.mjs
// ---------------------------------------------------------------
// Next.js configuration. We're keeping this minimal for now.
// You'll add things here later: image domains, redirects, env vars, etc.
// ---------------------------------------------------------------

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch bugs during development (runs effects twice on purpose - don't be alarmed)

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
