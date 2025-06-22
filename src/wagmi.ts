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

// Public RPC URLs for Sepolia
const SEPOLIA_RPC_URLS = [
  'https://rpc.sepolia.org',
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura endpoint
  'https://rpc2.sepolia.org',
  'https://eth-sepolia.g.alchemy.com/v2/demo', // Public Alchemy demo endpoint
];

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(SEPOLIA_RPC_URLS[0], {
      // Add fallback URLs
      retryCount: 3,
      timeout: 10000,
    }),
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