import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// ---------------------------------------------------------------------------
// Single wagmi config for the entire app.
//
// - Marketplace pages   → useWriteContract / useSendTransaction
// - Account-setup pages → useSignMessage / useSignTypedData
//
// Both use this same config — the hooks handle the behavioural difference.
// ---------------------------------------------------------------------------

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
      metadata: {
        name: 'Shadawi',
        description: 'Every Shadawi carries a legend.',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['/images/favicon.png'],
      },
    }),
    coinbaseWallet({ appName: 'Shadawi' }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL_MAINNET || undefined),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || undefined),
  },
  ssr: true,
})
