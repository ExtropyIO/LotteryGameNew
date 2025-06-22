// FILE: src/components/Connect.tsx
// PURPOSE: Handles wallet connection, displays account info, and the disconnect button.

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function Connect() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="wallet-info-card">
      <h2>Wallet Information</h2>
      <div>
        Status: <strong>{account.status}</strong>
      </div>
      {account.status === 'connected' && (
        <>
            <div>Addresses: {account.addresses?.join(', ')}</div>
            <div>Chain ID: {account.chainId}</div>
            <button type="button" onClick={() => disconnect()} className="button-disconnect">
                Disconnect
            </button>
        </>
      )}

      {account.status === 'disconnected' && (
          <div className="connector-buttons">
              <h3>Connect Wallet</h3>
              {connectors.map((connector) => (
              <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="button"
              >
                  {connector.name}
              </button>
              ))}
          </div>
      )}
        
      {error && <div>{error.message}</div>}
    </div>
  )
}