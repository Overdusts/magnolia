import React from 'react';
import BalanceCard from './BalanceCard';
import PositionsTable from './PositionsTable';
import TradesTable from './TradesTable';

export default function Dashboard({ balance, positions, trades, loading }) {
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Connecting to BloFin...</p>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <BalanceCard balance={balance} />
      <PositionsTable positions={positions} />
      <TradesTable trades={trades} />
    </main>
  );
}
