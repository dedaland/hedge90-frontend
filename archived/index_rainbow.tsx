import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { WagmiProvider} from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { queryClient, config } from './wallet';


import App from './App';
import AdminPage from './pages/admin'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


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
              <RouterProvider router={router} />
            </RainbowKitProvider>
      </QueryClientProvider>

        </WagmiProvider>
  </React.StrictMode>
);

