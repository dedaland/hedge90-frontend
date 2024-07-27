import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { WagmiProvider } from "wagmi";

import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig, queryClient } from './wallet-connect'
import App from './App';


// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "0d6e5c92264b0ded8e52916d2aa84c84";


// 3. Create modal
createWeb3Modal({ 
    wagmiConfig, projectId,
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#000',
      }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);