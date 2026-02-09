import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [balance, setBalance] = useState(null);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [balRes, posRes, tradeRes] = await Promise.all([
        fetch('/api/balance'),
        fetch('/api/positions'),
        fetch('/api/trades'),
      ]);

      if (!balRes.ok || !posRes.ok || !tradeRes.ok) {
        const errData = await balRes.json().catch(() => ({}));
        throw new Error(errData.error || 'API request failed');
      }

      const [balData, posData, tradeData] = await Promise.all([
        balRes.json(),
        posRes.json(),
        tradeRes.json(),
      ]);

      setBalance(balData);
      setPositions(Array.isArray(posData) ? posData : []);
      setTrades(Array.isArray(tradeData) ? tradeData : []);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="logo">magnolia</h1>
          <span className="subtitle">BloFin Dashboard</span>
        </div>
        <div className="header-right">
          {error && <span className="status-error">disconnected</span>}
          {!error && !loading && <span className="status-live">live</span>}
          {loading && <span className="status-loading">connecting...</span>}
          {lastUpdate && (
            <span className="last-update">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <Dashboard
        balance={balance}
        positions={positions}
        trades={trades}
        loading={loading}
      />
    </div>
  );
}
