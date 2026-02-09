import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function StatsRow({ balance, positions, trades }) {
  const data = Array.isArray(balance) ? balance[0] : balance;
  const totalEquity = parseFloat(data?.totalEquity) || 0;
  const details = data?.details || [];

  const totalUnrealizedPnl = positions.reduce(
    (sum, p) => sum + (parseFloat(p.unrealizedPnl) || 0),
    0
  );

  const totalMargin = positions.reduce(
    (sum, p) => sum + (parseFloat(p.initialMargin) || 0),
    0
  );

  const pnlClass = totalUnrealizedPnl >= 0 ? 'profit' : 'loss';
  const pnlPrefix = totalUnrealizedPnl >= 0 ? '+' : '';

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-icon">$</div>
        <span className="stat-label">Total Equity</span>
        <span className="stat-value">${fmt(totalEquity)}</span>
      </div>

      <div className="stat-card">
        <div className={`stat-icon ${totalUnrealizedPnl >= 0 ? 'green' : 'red'}`}>
          {totalUnrealizedPnl >= 0 ? '+' : '-'}
        </div>
        <span className="stat-label">Unrealized PnL</span>
        <span className={`stat-value ${pnlClass}`}>
          {pnlPrefix}${fmt(Math.abs(totalUnrealizedPnl))}
        </span>
      </div>

      <div className="stat-card">
        <div className="stat-icon blue">#</div>
        <span className="stat-label">Open Positions</span>
        <span className="stat-value">{positions.length}</span>
        {totalMargin > 0 && (
          <span className="stat-sub" style={{ color: 'var(--text-tertiary)' }}>
            ${fmt(totalMargin)} margin
          </span>
        )}
      </div>

      <div className="stat-card">
        <div className="stat-icon">T</div>
        <span className="stat-label">Recent Trades</span>
        <span className="stat-value">{trades.length}</span>
      </div>
    </div>
  );
}
