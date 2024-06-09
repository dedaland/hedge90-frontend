import '@rainbow-me/rainbowkit/styles.css';
import './polyfills';
import './index.css';
import { metaMaskWallet, trustWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';

import { WagmiProvider, http, createConfig} from 'wagmi';
import { fallback, unstable_connector  } from '@wagmi/core'
import { injected } from 'wagmi/connectors'
import {
  bsc,
  sepolia,
  bscTestnet
} from 'wagmi/chains';



const connectors = connectorsForWallets(
  [{ groupName: 'Wallets', wallets: [metaMaskWallet, trustWallet, injectedWallet] }],
  {
    appName: 'My RainbowKit App',
    // projectId: "NO_PROJECT",
    projectId: "0d6e5c92264b0ded8e52916d2aa84c84",
  },
);

export const config = createConfig({
  connectors: [
    ...connectors,
  ],
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(process.env.RPC_URL)//http("https://sepolia.infura.io/v3/3b14b0c3e9f246f59b141820d1936066")//http("https://go.getblock.io/874b729c0579489e95445e53e0e1dd23") //unstable_connector(injected)
  },
  multiInjectedProviderDiscovery: true
});


export const queryClient = new QueryClient();


