// FILE: src/hooks/useLottery.ts
// PURPOSE: Contains all Wagmi hooks for interacting with the Lottery contract.

import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from 'wagmi'
import { lotteryContractConfig } from '../wagmi'
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

// A type definition for a Team object
export type Team = {
  name: string;
  address: `0x${string}`;
  score: number;
};

/**
 * Fetches the total number of registered teams.
 */
export function useGetTeamCount() {
  const { chain } = useAccount();
  const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

  return useReadContract({
    ...lotteryContractConfig,
    address: contractAddress,
    functionName: 'getTeamCount',
  });
}

/**
 * Fetches details for a single team by its index.
 * @param teamIndex - The index of the team in the teamAddresses array.
 */
export function useGetTeamDetails(teamIndex: number) {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    return useReadContract({
        ...lotteryContractConfig,
        address: contractAddress,
        functionName: 'getTeamDetails',
        args: [BigInt(teamIndex)],
        query: {
          enabled: teamIndex !== undefined,
        }
    });
}

/**
 * Hook to register a new team.
 * Provides the write function, loading state, and transaction data.
 */
export function useRegisterTeam() {
  const { chain } = useAccount();
  const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

  const { data: hash, isPending, isSuccess, writeContract, error } = useWriteContract();

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ 
    hash,
  });

  // Exposing a function to be called from the component
  const registerTeam = async (walletAddress: `0x${string}`, teamName: string, password: string) => {
    if (!contractAddress) {
      console.error('No contract address found for chain:', chain?.id);
      return;
    }

    try {
      writeContract({
        ...lotteryContractConfig,
        address: contractAddress,
        functionName: 'registerTeam',
        args: [walletAddress, teamName, password],
        value: parseEther('0.01'), // UPDATED: The contract now requires a 0.01 ETH deposit
      });
    } catch (err) {
      console.error('Error calling writeContract:', err);
    }
  };

  return {
    registerTeam,
    isLoading: isPending || isConfirming,
    isSuccess: isSuccess && isConfirmed,
    error,
    receipt,
    hash,
  };
}

/**
 * Hook to make a guess.
 */
export function useMakeGuess() {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    const { data: hash, isPending, isSuccess, writeContract, error } = useWriteContract();

    const {
        data: receipt,
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ 
        hash,
    });

    const makeGuess = (teamAddress: `0x${string}`, guess: number) => {
        if (!contractAddress) {
            console.error('No contract address found');
            return;
        }

        writeContract({
            ...lotteryContractConfig,
            address: contractAddress,
            functionName: 'makeAGuess',
            args: [teamAddress, BigInt(guess)],
        });
    };

    return {
        makeGuess,
        isLoading: isPending || isConfirming,
        isSuccess: isSuccess && isConfirmed,
        error,
        receipt,
    };
}

/**
 * Hook to get the ETH balance of the lottery contract.
 */
export function useGetLotteryBalance(refetchTrigger: any) {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    const { data, refetch } = useBalance({
        address: contractAddress,
    });

    // Refetch balance when the trigger changes
    useEffect(() => {
        if (contractAddress) {
            refetch();
        }
    }, [refetchTrigger, refetch, contractAddress]);

    return data;
}

/**
 * Hook to listen for contract events and trigger a refetch of data.
 */
export function useLotteryEvents(refetch: () => void) {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    useWatchContractEvent({
        ...lotteryContractConfig,
        address: contractAddress,
        eventName: 'LogTeamRegistered',
        onLogs: (logs) => {
            console.log('Team Registered Event:', logs);
            refetch();
        },
    });

    useWatchContractEvent({
        ...lotteryContractConfig,
        address: contractAddress,
        eventName: 'LogGuessMade',
        onLogs: (logs) => {
            console.log('Guess Made Event:', logs);
            refetch();
        },
    });
}