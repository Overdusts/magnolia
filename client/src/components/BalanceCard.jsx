import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function PnlValue({ value }) {
  const num = parseFloat(value);
  if (isNaN(num)) return <span className="mono">—</span>;
  const cls = num >= 0 ? 'profit' : 'loss';
  const prefix = num >= 0 ? '+' : '';
  return <span className={`mono ${cls}`}>{prefix}{fmt(num)}</span>;
}

export default function BalanceCard({ balance }) {
  if (!balance) {
    return (
      <div className="card balance-card">
        <h2 className="card-title">Account Balance</h2>
        <p className="empty-state">No balance data</p>
      </div>
    );
  }

  // balance can be an object or array with one item
  const data = Array.isArray(balance) ? balance[0] : balance;
  const details = data?.details || [];

  return (
    <div className="card balance-card">
      <h2 className="card-title">Account Balance</h2>
      <div className="balance-grid">
        <div className="balance-item">
          <span className="label">Total Equity</span>
          <span className="value mono">${fmt(data?.totalEquity)}</span>
        </div>
        <div className="balance-item">
          <span className="label">Isolated Equity</span>
          <span className="value mono">${fmt(data?.isolatedEquity)}</span>
        </div>
        {details.map((d, i) => (
          <React.Fragment key={i}>
            <div className="balance-item">
              <span className="label">{d.currency} Balance</span>
              <span className="value mono">{fmt(d.balance)}</span>
            </div>
            <div className="balance-item">
              <span className="label">{d.currency} Available</span>
              <span className="value mono">{fmt(d.available)}</span>
            </div>
            <div className="balance-item">
              <span className="label">{d.currency} Equity (USD)</span>
              <span className="value mono">${fmt(d.equityUsd)}</span>
            </div>
            <div className="balance-item">
              <span className="label">{d.currency} Unrealized PnL</span>
              <PnlValue value={d.isolatedUnrealizedPnl} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
