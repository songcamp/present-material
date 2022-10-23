import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

// not in use
import { AppWrapper } from '../context/useAppContext';
import Scrollbars from 'react-custom-scrollbars-2';


const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => (chain.id === 1 ? { http: `https://rpc.ankr.com/eth` } : null)
    }),
    alchemyProvider({ 
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
      priority: 1
    }),
    infuraProvider({ priority: 2 }),
    publicProvider({ priority: 3 })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains} 
        theme={darkTheme({
          borderRadius: "none",
          accentColor: "#00c2ff",
          accentColorForeground: "#0E0411"
      })}>
          <AppWrapper>
            <Component {...pageProps} />
          </AppWrapper>
      </RainbowKitProvider>
    </WagmiConfig>        
  )
}

export default MyApp
