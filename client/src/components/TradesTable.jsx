import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(parseInt(ts)).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function getSymbol(instId) {
  return instId ? instId.split('-')[0] : '?';
}

export default function TradesTable({ trades, compact }) {
  const items = compact ? trades.slice(0, 5) : trades;

  return (
    <div className="glass border border-border rounded-[14px] overflow-hidden transition-all hover:border-border-strong">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-txt-secondary flex items-center gap-2.5">
          Recent Trades
          <span className="text-[11px] font-mono font-semibold bg-accent-dim text-accent px-2 py-0.5 rounded-full">{trades.length}</span>
        </h2>
      </div>

      {trades.length === 0 ? (
        <div className="text-txt-muted text-sm py-12 text-center flex flex-col items-center gap-2">
          <span className="text-3xl opacity-30">~</span>
          No recent trades
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Time', 'Instrument', 'Side', 'Price', 'Size', ...(!compact ? ['Fee'] : []), 'Role'].map((h) => (
                  <th key={h} className="text-left px-4.5 py-2.5 text-[11px] uppercase tracking-wider text-txt-muted font-semibold whitespace-nowrap bg-bg/30 border-b border-border first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((trade, i) => {
                const side = trade.side;
                const sideChip = side === 'buy'
                  ? 'bg-profit-bg text-profit border-profit-border'
                  : 'bg-loss-bg text-loss border-loss-border';
                const isMaker = trade.execType === 'M';

                return (
                  <tr key={trade.tradeId || i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4.5 py-3 border-b border-border first:pl-5 whitespace-nowrap text-[13px] font-mono text-txt-secondary">{formatTime(trade.ts)}</td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-elevated border border-border-strong flex items-center justify-center text-[9px] font-bold text-txt-dim font-mono">
                          {getSymbol(trade.instId).slice(0, 2)}
                        </div>
                        <span className="font-semibold text-txt text-[13px] font-mono">{trade.instId}</span>
                      </div>
                    </td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${sideChip}`}>{side}</span>
                    </td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(trade.price, 4)}</td>
                    <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(trade.size, 4)}</td>
                    {!compact && <td className="px-4.5 py-3 border-b border-border whitespace-nowrap text-[13px] font-mono text-txt-secondary">{fmt(trade.fee, 4)}</td>}
                    <td className="px-4.5 py-3 border-b border-border last:pr-5 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${isMaker ? 'bg-info-bg text-info border-info-border' : 'bg-warn-bg text-warn border-warn-border'}`}>
                        {isMaker ? 'Maker' : 'Taker'}
                      </span>
                    </td>
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
