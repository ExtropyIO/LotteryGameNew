// FILE: src/components/Header.tsx
// PURPOSE: Displays the main header and lottery contract balance.

import { useGetLotteryBalance } from '../hooks/useLottery'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

// UPDATED: The refetchTrigger prop has been removed
export function Header() {
  const { chain } = useAccount();
  const balance = useGetLotteryBalance();

  return (
    <nav className="navbar">
      <h1>Lottery Game</h1>
      {chain && balance && (
        <div className="navbar-balance">
          Lottery Balance: {Number(formatEther(balance.value)).toFixed(4)} {balance.symbol}
        </div>
      )}
    </nav>
  )
}