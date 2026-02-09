import React from 'react';
import BalanceCard from './BalanceCard';
import PositionsTable from './PositionsTable';
import TradesTable from './TradesTable';
import OrdersTable from './OrdersTable';
import StatsRow from './StatsRow';

export default function Dashboard({ balance, positions, trades, orders, loading, activeTab }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
        <div className="text-4xl font-extrabold bg-gradient-to-br from-accent-bright via-accent to-indigo-400 bg-clip-text text-transparent tracking-tight">
          magnolia
        </div>
        <div className="w-10 h-10 border-3 border-border border-t-accent rounded-full animate-spin" />
        <p className="text-[13px] text-txt-muted font-medium">Connecting to BloFin...</p>
      </div>
    );
  }

  return (
    <main className="px-8 py-7 flex flex-col gap-6 max-w-[1520px] mx-auto w-full">
      {activeTab === 'overview' && (
        <>
          <div className="animate-fade-in">
            <StatsRow balance={balance} positions={positions} trades={trades} />
          </div>
          <div className="animate-fade-in-d1">
            <BalanceCard balance={balance} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-d2">
            <PositionsTable positions={positions} compact />
            <TradesTable trades={trades} compact />
          </div>
        </>
      )}

      {activeTab === 'positions' && (
        <div className="animate-fade-in">
          <PositionsTable positions={positions} />
        </div>
      )}

      {activeTab === 'trades' && (
        <div className="animate-fade-in">
          <TradesTable trades={trades} />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          <OrdersTable orders={orders} />
        </div>
      )}
    </main>
  );
}
