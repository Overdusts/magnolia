import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function getSymbol(instId) {
  if (!instId) return '?';
  return instId.split('-')[0];
}

export default function PositionsTable({ positions, compact }) {
  const items = compact ? positions.slice(0, 5) : positions;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Open Positions
          <span className="badge">{positions.length}</span>
        </h2>
      </div>
      <div className="card-body">
        {positions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">~</div>
            No open positions
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Side</th>
                  <th>Size</th>
                  <th>Entry</th>
                  <th>Mark</th>
                  {!compact && <th>Liq. Price</th>}
                  <th>Leverage</th>
                  <th>PnL</th>
                  {!compact && <th>Margin</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((pos, i) => {
                  const pnl = parseFloat(pos.unrealizedPnl) || 0;
                  const pnlPct = parseFloat(pos.unrealizedPnlRatio) || 0;
                  const side = pos.positionSide;
                  const pnlClass = pnl >= 0 ? 'profit' : 'loss';

                  return (
                    <tr key={pos.positionId || i}>
                      <td>
                        <div className="inst-cell">
                          <div className="inst-icon">{getSymbol(pos.instId).slice(0, 2)}</div>
                          <span className="inst-name mono">{pos.instId}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`side-chip ${side}`}>{side}</span>
                      </td>
                      <td className="mono">{fmt(pos.positions, 4)}</td>
                      <td className="mono">{fmt(pos.averagePrice, 4)}</td>
                      <td className="mono">{fmt(pos.markPrice, 4)}</td>
                      {!compact && <td className="mono">{fmt(pos.liquidationPrice, 4)}</td>}
                      <td>
                        <span className="leverage-chip">{pos.leverage}x</span>
                      </td>
                      <td>
                        <div className={`pnl-cell ${pnlClass}`}>
                          <span className="pnl-value mono">
                            {pnl >= 0 ? '+' : ''}{fmt(pnl)}
                          </span>
                          <span className="pnl-pct mono">
                            {pnlPct >= 0 ? '+' : ''}{fmt(pnlPct * 100)}%
                          </span>
                        </div>
                      </td>
                      {!compact && <td className="mono">${fmt(pos.initialMargin)}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
