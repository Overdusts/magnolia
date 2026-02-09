import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function BalanceCard({ balance }) {
  if (!balance) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass border border-border rounded-[14px] p-7 relative overflow-hidden">
          <div className="text-xs font-medium text-txt-dim uppercase tracking-wider mb-2">Total Equity</div>
          <div className="text-[42px] font-extrabold font-mono tracking-tight leading-tight bg-gradient-to-br from-txt to-txt-secondary bg-clip-text text-transparent">$0.00</div>
          <p className="text-txt-muted text-[13px] mt-4">No balance data available</p>
        </div>
      </div>
    );
  }

  const data = Array.isArray(balance) ? balance[0] : balance;
  const details = data?.details || [];
  const totalEquity = parseFloat(data?.totalEquity) || 0;
  const isolatedEquity = parseFloat(data?.isolatedEquity) || 0;
  const totalAvailable = details.reduce((s, d) => s + (parseFloat(d.available) || 0), 0);
  const totalFrozen = details.reduce((s, d) => s + (parseFloat(d.frozen) || 0), 0);
  const totalUPnl = details.reduce((s, d) => s + (parseFloat(d.isolatedUnrealizedPnl) || 0), 0);

  const detailItems = [
    { label: 'Isolated Equity', value: `$${fmt(isolatedEquity)}` },
    { label: 'Available', value: `$${fmt(totalAvailable)}` },
    { label: 'Frozen', value: `$${fmt(totalFrozen)}` },
    { label: 'Unrealized PnL', value: `${totalUPnl >= 0 ? '+' : ''}${fmt(totalUPnl)}`, color: totalUPnl >= 0 ? 'text-profit' : 'text-loss' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Hero */}
      <div className="glass border border-border rounded-[14px] p-7 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/5 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(167,139,250,0.06),transparent_70%)] pointer-events-none" />
        <div className="text-xs font-medium text-txt-dim uppercase tracking-wider mb-2">Total Equity</div>
        <div className="text-[42px] font-extrabold font-mono tracking-tight leading-tight mb-5 bg-gradient-to-br from-txt to-txt-secondary bg-clip-text text-transparent">
          ${fmt(totalEquity)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {detailItems.map((item, i) => (
            <div key={i} className="bg-surface rounded-[10px] border border-border p-3.5">
              <div className="text-[11px] text-txt-muted uppercase tracking-wide font-medium mb-1">{item.label}</div>
              <div className={`text-base font-semibold font-mono ${item.color || 'text-txt'}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Breakdown */}
      <div className="glass border border-border rounded-[14px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-txt-secondary flex items-center gap-2.5">
            Currency Breakdown
            <span className="text-[11px] font-mono font-semibold bg-accent-dim text-accent px-2 py-0.5 rounded-full">{details.length}</span>
          </h2>
        </div>
        <div className="p-2">
          {details.length === 0 ? (
            <div className="text-txt-muted text-sm py-12 text-center flex flex-col items-center gap-2">
              <span className="text-3xl opacity-30">$</span>
              No currencies found
            </div>
          ) : (
            details.map((d, i) => {
              const upnl = parseFloat(d.isolatedUnrealizedPnl) || 0;
              return (
                <div key={i} className="flex items-center justify-between px-4 py-3.5 rounded-[10px] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center font-bold text-xs text-accent font-mono">
                      {(d.currency || '?').slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-txt">{d.currency}</div>
                      <div className="text-xs text-txt-dim mt-0.5">Available: {fmt(d.available)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold font-mono text-txt">{fmt(d.balance)}</div>
                    <div className={`text-xs font-mono mt-0.5 ${upnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      uPnL: {upnl >= 0 ? '+' : ''}{fmt(upnl)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
