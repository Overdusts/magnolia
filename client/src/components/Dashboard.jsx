import React from 'react';
import BalanceCard from './BalanceCard';
import PositionsTable from './PositionsTable';
import TradesTable from './TradesTable';
import OrdersTable from './OrdersTable';
import StatsRow from './StatsRow';

export default function Dashboard({ balance, positions, trades, orders, loading, activeTab }) {
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">magnolia</div>
        <div className="spinner-ring" />
        <p className="loading-text">Connecting to BloFin...</p>
      </div>
    );
  }

  return (
    <main className="dashboard">
      {activeTab === 'overview' && (
        <>
          <div className="fade-in">
            <StatsRow balance={balance} positions={positions} trades={trades} />
          </div>
          <div className="fade-in fade-in-delay-1">
            <BalanceCard balance={balance} />
          </div>
          <div className="two-col fade-in fade-in-delay-2">
            <PositionsTable positions={positions} compact />
            <TradesTable trades={trades} compact />
          </div>
        </>
      )}

      {activeTab === 'positions' && (
        <div className="fade-in">
          <PositionsTable positions={positions} />
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="fade-in">
          <TradesTable trades={trades} />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="fade-in">
          <OrdersTable orders={orders} />
        </div>
      )}
    </main>
  );
}
