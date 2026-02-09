import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function PositionsTable({ positions }) {
  return (
    <div className="card">
      <h2 className="card-title">
        Open Positions
        <span className="badge">{positions.length}</span>
      </h2>
      {positions.length === 0 ? (
        <p className="empty-state">No open positions</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Side</th>
                <th>Size</th>
                <th>Entry Price</th>
                <th>Mark Price</th>
                <th>Liq. Price</th>
                <th>Leverage</th>
                <th>uPnL</th>
                <th>uPnL %</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, i) => {
                const pnl = parseFloat(pos.unrealizedPnl) || 0;
                const pnlPct = parseFloat(pos.unrealizedPnlRatio) || 0;
                const side = pos.positionSide;
                const sideClass = side === 'long' ? 'profit' : side === 'short' ? 'loss' : '';
                const pnlClass = pnl >= 0 ? 'profit' : 'loss';

                return (
                  <tr key={pos.positionId || i}>
                    <td className="mono">{pos.instId}</td>
                    <td className={sideClass}>{side?.toUpperCase()}</td>
                    <td className="mono">{fmt(pos.positions, 4)}</td>
                    <td className="mono">{fmt(pos.averagePrice, 4)}</td>
                    <td className="mono">{fmt(pos.markPrice, 4)}</td>
                    <td className="mono">{fmt(pos.liquidationPrice, 4)}</td>
                    <td className="mono">{pos.leverage}x</td>
                    <td className={`mono ${pnlClass}`}>
                      {pnl >= 0 ? '+' : ''}{fmt(pnl)}
                    </td>
                    <td className={`mono ${pnlClass}`}>
                      {pnlPct >= 0 ? '+' : ''}{fmt(pnlPct * 100)}%
                    </td>
                    <td className="mono">${fmt(pos.initialMargin)}</td>
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
