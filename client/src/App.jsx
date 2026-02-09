import React, { useState, useEffect, useCallback, useRef } from 'react';
import Dashboard from './components/Dashboard';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'positions', label: 'Positions' },
  { id: 'trades', label: 'Trades' },
  { id: 'orders', label: 'Orders' },
];

export default function App() {
  const [balance, setBalance] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [balRes, posRes, tradeRes, orderRes] = await Promise.all([
        fetch('/api/balance'),
        fetch('/api/positions'),
        fetch('/api/trades'),
        fetch('/api/orders'),
      ]);

      if (!balRes.ok) {
        const errData = await balRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch balance');
      }

      const [balData, posData, tradeData, orderData] = await Promise.all([
        balRes.json(),
        posRes.ok ? posRes.json() : [],
        tradeRes.ok ? tradeRes.json() : [],
        orderRes.ok ? orderRes.json() : [],
      ]);

      setBalance(balData);
      setPositions(Array.isArray(posData) ? posData : []);
      setTrades(Array.isArray(tradeData) ? tradeData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (manual) setTimeout(() => setRefreshing(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  return (
    <div className="flex flex-col min-h-screen text-txt">
      {/* Header */}
      <header className="flex items-center justify-between px-8 h-16 bg-bg/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <h1 className="text-[22px] font-extrabold bg-gradient-to-br from-accent-bright via-accent to-indigo-400 bg-clip-text text-transparent tracking-tight">
            magnolia
          </h1>
          <span className="text-xs text-txt-dim font-medium pl-3.5 border-l border-border-strong">
            BloFin Portfolio
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          {error && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-loss-bg text-loss border border-loss-border">
              <span className="w-1.5 h-1.5 rounded-full bg-loss" />
              disconnected
            </span>
          )}
          {!error && !loading && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-profit-bg text-profit border border-profit-border">
              <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse-dot shadow-[0_0_6px_var(--color-profit)]" />
              live
            </span>
          )}
          {loading && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-surface text-txt-dim border border-border-strong">
              <span className="w-1.5 h-1.5 rounded-full bg-txt-dim animate-pulse-dot-fast" />
              connecting
            </span>
          )}
          {lastUpdate && (
            <span className="text-[11px] text-txt-muted font-mono font-medium">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md border border-border-strong text-txt-secondary hover:border-accent hover:text-accent hover:bg-accent-dim transition-all cursor-pointer"
            onClick={() => fetchData(true)}
            title="Refresh now"
          >
            <svg className={refreshing ? 'animate-spin' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-0.5 px-8 bg-bg/50 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 text-[13px] font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap
              ${activeTab === tab.id
                ? 'text-accent-bright border-accent'
                : 'text-txt-dim border-transparent hover:text-txt-secondary hover:bg-white/[0.02]'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-8 py-3 bg-loss-bg border-b border-loss-border text-loss text-[13px] font-medium">
          {error}
        </div>
      )}

      {/* Content */}
      <Dashboard
        balance={balance}
        positions={positions}
        trades={trades}
        orders={orders}
        loading={loading}
        activeTab={activeTab}
      />

      {/* Footer */}
      <footer className="mt-auto px-8 py-5 text-center text-xs text-txt-muted border-t border-border">
        magnolia &mdash; BloFin Portfolio Dashboard
      </footer>
    </div>
  );
}
