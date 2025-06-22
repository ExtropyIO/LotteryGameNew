// FILE: src/hooks/useLottery.ts
// PURPOSE: Contains all Wagmi hooks for interacting with the Lottery contract.

import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt, // <-- CORRECTED: Changed from useWaitForTransaction
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

  return useContractRead({
    ...lotteryContractConfig,
    address: contractAddress,
    functionName: 'getTeamCount',
    // Watch for changes to refetch automatically
    watch: true,
  });
}

/**
 * Fetches details for a single team by its index.
 * @param teamIndex - The index of the team in the teamAddresses array.
 */
export function useGetTeamDetails(teamIndex: number) {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    return useContractRead({
        ...lotteryContractConfig,
        address: contractAddress,
        functionName: 'getTeamDetails',
        args: [BigInt(teamIndex)],
        enabled: teamIndex !== undefined, // Only run if teamIndex is valid
    });
}

/**
 * Hook to register a new team.
 * Provides the write function, loading state, and transaction data.
 */
export function useRegisterTeam() {
  const { chain } = useAccount();
  const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    ...lotteryContractConfig,
    address: contractAddress,
    functionName: 'registerTeam',
  });

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess: txIsSuccess,
  } = useWaitForTransactionReceipt({ hash: data?.hash }); // <-- CORRECTED HOOK

  // Exposing a function to be called from the component
  const registerTeam = (walletAddress: `0x${string}`, teamName: string, password: string) => {
    if (write) {
      write({
        args: [walletAddress, teamName, password],
        value: parseEther('2'), // The contract requires a 2 ETH deposit
      });
    }
  };

  return {
    registerTeam,
    isLoading: isLoading || isPending,
    isSuccess: isSuccess && txIsSuccess,
    error,
    receipt,
  };
}

/**
 * Hook to make a guess.
 */
export function useMakeGuess() {
    const { chain } = useAccount();
    const contractAddress = chain ? lotteryContractConfig.address(chain.id) : undefined;

    const { data, isLoading, isSuccess, write, error } = useContractWrite({
        ...lotteryContractConfig,
        address: contractAddress,
        functionName: 'makeAGuess',
    });

    const {
        data: receipt,
        isLoading: isPending,
        isSuccess: txIsSuccess,
    } = useWaitForTransactionReceipt({ hash: data?.hash }); // <-- CORRECTED HOOK

    const makeGuess = (teamAddress: `0x${string}`, guess: number) => {
        if(write) {
            write({
                args: [teamAddress, BigInt(guess)],
            });
        }
    };

    return {
        makeGuess,
        isLoading: isLoading || isPending,
        isSuccess: isSuccess && txIsSuccess,
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
        refetch();
    }, [refetchTrigger, refetch]);


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
        eventName: 'TeamRegistered',
        onLogs: (logs) => {
            console.log('Team Registered Event:', logs);
            refetch();
        },
    });

    useWatchContractEvent({
        ...lotteryContractConfig,
        address: contractAddress,
        eventName: 'LogGuessMade', // Ensure this event name matches your contract
        onLogs: (logs) => {
            console.log('Guess Made Event:', logs);
            refetch();
        },
    });
}
