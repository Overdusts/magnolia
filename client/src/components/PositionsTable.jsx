import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function getSymbol(instId) {
  return instId ? instId.split('-')[0] : '?';
}

export default function PositionsTable({ positions, compact }) {
  const items = compact ? positions.slice(0, 5) : positions;

  return (
    <div className="glass border border-border rounded-[14px] overflow-hidden transition-all hover:border-border-strong">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-txt-secondary flex items-center gap-2.5">
          Open Positions
          <span className="text-[11px] font-mono font-semibold bg-accent-dim text-accent px-2 py-0.5 rounded-full">{positions.length}</span>
        </h2>
      </div>

      {/* Body */}
      {positions.length === 0 ? (
        <div className="text-txt-muted text-sm py-12 text-center flex flex-col items-center gap-2">
          <span className="text-3xl opacity-30">~</span>
          No open positions
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Instrument', 'Side', 'Size', 'Entry', 'Mark', ...(!compact ? ['Liq. Price'] : []), 'Leverage', 'PnL', ...(!compact ? ['Margin'] : [])].map((h) => (
                  <th key={h} className="text-left px-4.5 py-2.5 text-[11px] uppercase tracking-wider text-txt-muted font-semibold whitespace-nowrap bg-bg/30 border-b border-border first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((pos, i) => {
                const pnl = parseFloat(pos.unrealizedPnl) || 0;
                const pnlPct = parseFloat(pos.unrealizedPnlRatio) || 0;
                const side = pos.positionSide;
                const pnlColor = pnl >= 0 ? 'text-profit' : 'text-loss';
                const sideChip = side === 'long'
                  ? 'bg-profit-bg text-profit border-profit-border'
                  : 'bg-loss-bg text-loss border-loss-border';

                return (
                  <tr key={pos.positionId || i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4.5 py-3 border-b border-border first:pl-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-elevated border border-border-strong flex items-center justify-center text-[9px] font-bold text-txt-dim font-mono">
                          {getSymbol(pos.instId).slice(0, 2)}
                        </div>
                        <span className="font-semibold text-txt text-[13px] font-mono">{pos.instId}</span>
                      </div>
                    </td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${sideChip}`}>{side}</span>
                    </td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(pos.positions, 4)}</td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(pos.averagePrice, 4)}</td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(pos.markPrice, 4)}</td>
                    {!compact && <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(pos.liquidationPrice, 4)}</td>}
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap">
                      <span className="inline-flex px-2 py-0.5 bg-warn-bg text-warn border border-warn-border rounded text-[11px] font-bold font-mono">{pos.leverage}x</span>
                    </td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap">
                      <div className={`flex flex-col gap-0.5 ${pnlColor}`}>
                        <span className="text-[13px] font-semibold font-mono">{pnl >= 0 ? '+' : ''}{fmt(pnl)}</span>
                        <span className="text-[11px] font-mono opacity-70">{pnlPct >= 0 ? '+' : ''}{fmt(pnlPct * 100)}%</span>
                      </div>
                    </td>
                    {!compact && <td className="px-4.5 py-3 border-b border-border last:pr-5 whitespace-nowrap text-[13px] font-mono text-txt-secondary">${fmt(pos.initialMargin)}</td>}
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
