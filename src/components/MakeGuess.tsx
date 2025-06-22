// FILE: src/components/MakeGuess.tsx
// PURPOSE: Component for the guess submission form.

import { useState } from 'react';
import { useMakeGuess } from '../hooks/useLottery';
import { isAddress } from 'viem';

export function MakeGuess() {
  const [teamAddress, setTeamAddress] = useState('');
  const [guess, setGuess] = useState('');
  const [formError, setFormError] = useState('');
  
  const { makeGuess, isLoading, isSuccess, error } = useMakeGuess();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGuessClick();
  };

  const handleGuessClick = () => {
    setFormError('');

    if (!isAddress(teamAddress)) {
      setFormError('Please enter a valid Ethereum address.');
      return;
    }

    if (teamAddress && guess) {
      makeGuess(teamAddress as `0x${string}`, parseInt(guess, 10));
    } else {
      setFormError('All fields are required.');
    }
  };

  return (
    <div className="form-card">
      <h3>Make a Guess</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guessAddressInput">Team Address</label>
          <input
            type="text"
            id="guessAddressInput"
            value={teamAddress}
            onChange={(e) => setTeamAddress(e.target.value)}
            placeholder="e.g. 0x..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guessInput">Guess (a number)</label>
          <input
            type="number"
            id="guessInput"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            min="0"
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className="button">
          {isLoading ? 'Submitting...' : 'Make a Guess'}
        </button>
      </form>
      {formError && <div className="error-message">{formError}</div>}
      {isSuccess && <div className="success-message">Guess submitted successfully!</div>}
      {error && <div className="error-message">Error: {error.message}</div>}
    </div>
  );
}