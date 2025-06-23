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

  // UPDATED: Re-introducing a nonce to reliably trigger refetches
  const [refetchNonce, setRefetchNonce] = useState(0);
  
  const { data: teamCount, refetch: refetchTeamCount, isSuccess: isTeamCountSuccess } = useGetTeamCount();

  const fetchAllTeams = useCallback(async () => {
    // First, ensure the team count is up-to-date. This is important for the first load.
    if (!isTeamCountSuccess) {
       await refetchTeamCount();
    }

    if (!isConnected || typeof teamCount !== 'bigint' || !chain) {
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
  }, [teamCount, isTeamCountSuccess, isConnected, chain, wagmiConfig, refetchTeamCount]);

  // UPDATED: A robust function to force a full data refetch
  const forceRefetch = useCallback(() => {
    // When called, this will always trigger a full data refresh
    setRefetchNonce(nonce => nonce + 1);
  }, []);

  // UPDATED: The main data fetching effect now listens for the nonce
  useEffect(() => {
    fetchAllTeams();
  }, [fetchAllTeams, refetchNonce]); // It runs when fetchAllTeams changes OR when the nonce changes.

  useLotteryEvents(forceRefetch);

  useEffect(() => {
    if (isConnected) {
      const intervalId = setInterval(() => {
        console.log("Periodically refreshing all data...");
        forceRefetch();
      }, 10000); 
      return () => clearInterval(intervalId);
    }
  }, [isConnected, forceRefetch]);

  return (
    <div className="app-container">
      <Header />
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