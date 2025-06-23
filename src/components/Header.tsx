// FILE: src/components/Header.tsx
// PURPOSE: Displays the main header and lottery contract balance.

import { useGetLotteryBalance } from '../hooks/useLottery'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

export function Header({ refetchTrigger }: { refetchTrigger: number }) {
  const { chain } = useAccount();
  const balance = useGetLotteryBalance(refetchTrigger);

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