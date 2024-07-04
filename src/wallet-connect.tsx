import { http, createConfig } from "wagmi";
import { defineChain } from 'viem'

import { bsc, bscTestnet, localhost } from "viem/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

import { QueryClient } from "@tanstack/react-query";


export function ConnectButton() {
    return <w3m-button balance='hide'/>
}

 
export const local_anvil = defineChain({
  id: 31337,
  name: 'Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
      webSocket: [],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'http://127.0.0.1:5100/' },
  },
  contracts: {},
})

const projectId = "0d6e5c92264b0ded8e52916d2aa84c84";
if (!projectId) throw new Error("Project ID is undefined");
const metadata = {
    name: "Web3Modal",
    description: "Hedge90 project",
    url: "https://test.hedge90.co",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };
export let wagmiConfig: any;
const IS_PROD = process.env.REACT_APP_IS_PROD === "true"
console.log("process.env.IS_PROD", IS_PROD, process.env.REACT_APP_RPC_URL)

if(IS_PROD){
    wagmiConfig = createConfig({
        chains: [bsc],
        transports: {
            [bsc.id]: http(process.env.RPC_URL),
        },
        connectors: [
            walletConnect({ projectId, metadata, showQrModal: false }),
            coinbaseWallet({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0],
            }),
        ],
    });
}else{
    wagmiConfig = createConfig({
        chains: [local_anvil],
        transports: {
            [local_anvil.id]: http(process.env.RPC_URL),
        },
        connectors: [
            walletConnect({ projectId, metadata, showQrModal: false }),
            coinbaseWallet({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0],
            }),
        ],
    });
}
export const queryClient = new QueryClient();