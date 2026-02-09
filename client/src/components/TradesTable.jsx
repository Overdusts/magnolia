import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(parseInt(ts)).toLocaleString();
}

export default function TradesTable({ trades }) {
  return (
    <div className="card">
      <h2 className="card-title">
        Recent Trades
        <span className="badge">{trades.length}</span>
      </h2>
      {trades.length === 0 ? (
        <p className="empty-state">No recent trades</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Instrument</th>
                <th>Side</th>
                <th>Price</th>
                <th>Size</th>
                <th>Fee</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, i) => {
                const side = trade.side;
                const sideClass = side === 'buy' ? 'profit' : 'loss';

                return (
                  <tr key={trade.tradeId || i}>
                    <td className="mono">{formatTime(trade.ts)}</td>
                    <td className="mono">{trade.instId}</td>
                    <td className={sideClass}>{side?.toUpperCase()}</td>
                    <td className="mono">{fmt(trade.price, 4)}</td>
                    <td className="mono">{fmt(trade.size, 4)}</td>
                    <td className="mono">{fmt(trade.fee, 4)}</td>
                    <td>{trade.execType === 'M' ? 'Maker' : 'Taker'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
