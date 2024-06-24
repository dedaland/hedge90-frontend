import { http, createConfig, WagmiProvider, Connector } from "wagmi";
import { Chain, bsc, bscTestnet } from "viem/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TransportConfig, EIP1193RequestFn } from "viem";
import { StoreApi } from "zustand/vanilla";

export function ConnectButton() {
    return <w3m-button balance='hide'/>
}

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
        chains: [bscTestnet],
        transports: {
            [bscTestnet.id]: http(process.env.RPC_URL),
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