// FILE: src/wagmi.ts
// PURPOSE: Configures Wagmi, chains, and contract details.

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { injected } from 'wagmi/connectors' 

import LotteryABI from '../contracts/out/Lottery.sol/Lottery.json'
import deployments from '../contracts/deployments.json'

// Type definition for the deployments JSON
type Deployments = {
  [chainId: string]: {
    name: string;
    contracts: {
      [contractName: string]: `0x${string}`;
    };
  };
};

const getContractAddress = (chainId: number): `0x${string}` | undefined => {
	const chainIdStr = String(chainId);
  const typedDeployments = deployments as Deployments;
	
	if (typedDeployments[chainIdStr]?.contracts?.Lottery) {
		return typedDeployments[chainIdStr].contracts.Lottery;
	}
	return undefined;
};

// --- NEW: Alchemy Configuration ---
// For security, it's best practice to use an environment variable for your API key.
// You can create a `.env.local` file in your project root and add:
// VITE_ALCHEMY_API_KEY="YOUR_API_KEY"
// Then, you would use: const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

const ALCHEMY_API_KEY = 'f0ffpkJ7iHBv3ztyroy1j'; 
const alchemySepoliaUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
// --- End of New Configuration ---

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    // --- UPDATED: Using Alchemy for Sepolia ---
    [sepolia.id]: http(alchemySepoliaUrl),
    [localhost.id]: http('http://127.0.0.1:8545'),
  },
})

export const lotteryContractConfig = {
  abi: LotteryABI.abi,
  address: (chainId: number) => getContractAddress(chainId),
} as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}