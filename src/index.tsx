import '@rainbow-me/rainbowkit/styles.css';
import './polyfills';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, trustWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

import { WagmiProvider, http, createConfig, fallback, unstable_connector } from 'wagmi';
import { injected } from 'wagmi/connectors'
import {
  arbitrum,
  base,
  mainnet,
  bsc,
  optimism,
  polygon,
  sepolia,
  bscTestnet
} from 'wagmi/chains';

import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const connectors = connectorsForWallets(
  [{ groupName: 'Wallets', wallets: [metaMaskWallet, trustWallet, injectedWallet] }],
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
  },
);

const config = createConfig({
  connectors: [
    ...connectors,
  ],
  chains: [bsc],
  transports: {
    [bsc.id]: fallback([
      unstable_connector(injected), 
    ]),
  },
  multiInjectedProviderDiscovery: true
});



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme({
          accentColor: '#000',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small'
        })}
    >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

