// FILE: src/components/TeamsTable.tsx
// PURPOSE: Renders the table of teams and their scores.

import { Team } from '../hooks/useLottery';

interface TeamsTableProps {
  teams: Team[];
  isLoading: boolean;
}

export function TeamsTable({ teams, isLoading }: TeamsTableProps) {
  // Sort teams by score in descending order
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="table-card">
      <h2>Team Scores</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Name</th>
            <th>Address</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4}>Loading teams...</td>
            </tr>
          ) : sortedTeams.length > 0 ? (
            sortedTeams.map((team, index) => (
              <tr key={team.address}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.address}</td>
                <td>{team.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No teams registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}