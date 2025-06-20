import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// Import contract ABI
import MyContractABI from '../contracts/out/MyContract.sol/MyContract.json'

// Import deployment addresses
import deployments from '../contracts/deployments.json'

// Contract addresses by network
const contractAddresses = {
  [mainnet.id]: deployments[1]?.contracts?.MyContract || '',
  [sepolia.id]: deployments[11155111]?.contracts?.MyContract || '',
  [localhost.id]: deployments[31337]?.contracts?.MyContract || '',
}

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http('http://localhost:8545'),
  },
})

// Export contract config
export const myContractConfig = {
  abi: MyContractABI.abi,
  address: (chainId: number) => contractAddresses[chainId] || '',
} as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}


