import { useContractRead, useContractWrite, useNetwork } from 'wagmi'
import { myContractConfig } from '../wagmi'

export function useMyContract() {
  const { chain } = useNetwork()
  const chainId = chain?.id || 1
  
  const contractAddress = myContractConfig.address(chainId)
  
  const { data: value } = useContractRead({
    address: contractAddress,
    abi: myContractConfig.abi,
    functionName: 'value',
  })
  
  const { write: setValue } = useContractWrite({
    address: contractAddress,
    abi: myContractConfig.abi,
    functionName: 'setValue',
  })
  
  return {
    value,
    setValue,
    contractAddress,
  }
}