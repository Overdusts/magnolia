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
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">magnolia</h1>
          <span className="subtitle">BloFin Portfolio</span>
        </div>
        <div className="header-right">
          {error && <span className="status-error">disconnected</span>}
          {!error && !loading && <span className="status-live">live</span>}
          {loading && <span className="status-loading">connecting</span>}
          {lastUpdate && (
            <span className="last-update">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchData(true)}
            title="Refresh now"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <Dashboard
        balance={balance}
        positions={positions}
        trades={trades}
        orders={orders}
        loading={loading}
        activeTab={activeTab}
      />

      <footer className="footer">
        magnolia &mdash; BloFin Portfolio Dashboard
      </footer>
    </div>
  );
}
