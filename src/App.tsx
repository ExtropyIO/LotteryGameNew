// FILE: src/App.tsx
// PURPOSE: Main application component, lays out the UI and manages state.

import { useAccount, useConfig } from 'wagmi';
import { readContracts } from 'wagmi/actions';
import { useState, useEffect, useCallback } from 'react';
import { lotteryContractConfig } from './wagmi';
import { Team, useGetTeamCount, useLotteryEvents } from './hooks/useLottery';

import { Header } from './components/Header';
import { Connect } from './components/Connect';
import { RegisterTeam } from './components/RegisterTeam';
import { MakeGuess } from './components/MakeGuess';
import { TeamsTable } from './components/TeamsTable';

function App() {
  const { isConnected, chain } = useAccount();
  const wagmiConfig = useConfig();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Get team count and the detailed status/error of the fetch
  const { 
    data: teamCount, 
    refetch: refetchTeamCount, 
    isSuccess: isTeamCountSuccess,
    status: teamCountStatus,
    error: teamCountError,
  } = useGetTeamCount();

  // --- DEBUGGING BLOCK ---
  // This will log the detailed status of the team count query
  useEffect(() => {
    console.log('%c[Debug] Team Count Hook Status:', 'color: orange; font-weight: bold;', {
        status: teamCountStatus,
        isSuccess: isTeamCountSuccess,
        teamCount: teamCount?.toString(),
        error: teamCountError,
    });
  }, [teamCountStatus, isTeamCountSuccess, teamCount, teamCountError]);
  // --- END DEBUGGING BLOCK ---

  const fetchAllTeams = useCallback(async () => {
    if (!isConnected || !isTeamCountSuccess || typeof teamCount !== 'bigint' || !chain) {
      return;
    }
    
    const count = Number(teamCount);
    if (count === 0) {
      setTeams([]);
      setIsLoadingTeams(false);
      return;
    }

    setIsLoadingTeams(true);
    try {
      const contractAddress = lotteryContractConfig.address(chain.id);
      if (!contractAddress) {
        throw new Error("Contract address not found for this chain.");
      }

      const contracts = Array.from({ length: count }, (_, i) => ({
        ...lotteryContractConfig,
        address: contractAddress,
        functionName: 'getTeamDetails',
        args: [BigInt(i)],
      }));

      const results = await readContracts(wagmiConfig, { contracts });
      
      const validResults: Team[] = results
        .filter(r => r.status === 'success' && r.result)
        .map(r => {
          if (!Array.isArray(r.result)) return null;
          const [name, address, score] = r.result as [string, `0x${string}`, bigint];
          return { name, address, score: Number(score) };
        }).filter((r): r is Team => r !== null);
      
      setTeams(validResults);
    } catch (e) {
      console.error("Failed to fetch teams:", e);
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  }, [teamCount, isTeamCountSuccess, chain, isConnected, wagmiConfig]);

  const forceRefetch = useCallback(() => {
    refetchTeamCount();
    setRefetchTrigger(prev => prev + 1);
  }, [refetchTeamCount]);

  useEffect(() => {
    fetchAllTeams();
  }, [fetchAllTeams]);

  useLotteryEvents(forceRefetch);

  useEffect(() => {
    if (isConnected) {
      const intervalId = setInterval(() => {
        forceRefetch();
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isConnected, forceRefetch]);

  return (
    <div className="app-container">
      <Header refetchTrigger={refetchTrigger} />
      <main className="main-content">
        <div className="content-grid">
          <div className="forms-column">
            <Connect />
            {isConnected && (
              <>
                <RegisterTeam />
                <MakeGuess />
              </>
            )}
          </div>
          <div className="table-column">
             <TeamsTable teams={teams} isLoading={isLoadingTeams} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;