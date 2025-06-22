// FILE: src/components/RegisterTeam.tsx
// PURPOSE: Component for the team registration form.

import { useState } from 'react'
import { useRegisterTeam } from '../hooks/useLottery'
import { isAddress } from 'viem'; 

export function RegisterTeam() {
  const [teamName, setTeamName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { registerTeam, isLoading, isSuccess, error } = useRegisterTeam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegisterClick();
  };

  const handleRegisterClick = () => {
    setFormError(''); 

    if (!isAddress(walletAddress)) {
      setFormError('Please enter a valid Ethereum address.');
      return;
    }
    
    if (teamName && walletAddress && password) {
      registerTeam(walletAddress as `0x${string}`, teamName, password);
    } else {
      setFormError('All fields are required.');
    }
  };

  return (
    <div className="form-card">
      <h3>Register Team</h3>
      <p className="small-text">(Requires a 0.01 ETH deposit)</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="registerNameInput">Team Name</label>
          <input
            type="text"
            id="registerNameInput"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerAddressInput">Wallet Address</label>
          <input
            type="text"
            id="registerAddressInput"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="e.g. 0x..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerPasswordInput">Password</label>
          <input
            type="password"
            id="registerPasswordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className="button">
          {isLoading ? 'Registering...' : 'Register Team'}
        </button>
      </form>
      {formError && <div className="error-message">{formError}</div>}
      {isSuccess && <div className="success-message">Team registered successfully!</div>}
      {error && <div className="error-message">Error: {error.message}</div>}
    </div>
  );
}