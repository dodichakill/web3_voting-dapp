import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { monad, monadTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DemokrasiChain - Sistem Voting Terdesentralisasi',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Perlu diganti dengan project ID yang valid
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://rpc.testnet-1.monad.xyz'),
  },
  ssr: true,
});
