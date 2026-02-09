import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function StatsRow({ balance, positions, trades }) {
  const data = Array.isArray(balance) ? balance[0] : balance;
  const totalEquity = parseFloat(data?.totalEquity) || 0;

  const totalUnrealizedPnl = positions.reduce((s, p) => s + (parseFloat(p.unrealizedPnl) || 0), 0);
  const totalMargin = positions.reduce((s, p) => s + (parseFloat(p.initialMargin) || 0), 0);

  const pnlColor = totalUnrealizedPnl >= 0 ? 'text-profit' : 'text-loss';
  const pnlIconBg = totalUnrealizedPnl >= 0 ? 'bg-profit-bg text-profit' : 'bg-loss-bg text-loss';
  const pnlPrefix = totalUnrealizedPnl >= 0 ? '+' : '';

  const cards = [
    {
      icon: '$', iconClass: 'bg-accent-dim text-accent',
      label: 'Total Equity',
      value: `$${fmt(totalEquity)}`,
      valueClass: 'text-txt',
    },
    {
      icon: totalUnrealizedPnl >= 0 ? '+' : '-', iconClass: pnlIconBg,
      label: 'Unrealized PnL',
      value: `${pnlPrefix}$${fmt(Math.abs(totalUnrealizedPnl))}`,
      valueClass: pnlColor,
    },
    {
      icon: '#', iconClass: 'bg-info-bg text-info',
      label: 'Open Positions',
      value: positions.length,
      valueClass: 'text-txt',
      sub: totalMargin > 0 ? `$${fmt(totalMargin)} margin` : null,
    },
    {
      icon: 'T', iconClass: 'bg-accent-dim text-accent',
      label: 'Recent Trades',
      value: trades.length,
      valueClass: 'text-txt',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="glass border border-border rounded-[14px] p-5 flex flex-col gap-2.5 transition-all hover:border-border-strong hover:shadow-[0_0_40px_rgba(167,139,250,0.06)] relative overflow-hidden group"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className={`w-9 h-9 rounded-md flex items-center justify-center text-base font-bold font-mono ${c.iconClass}`}>
            {c.icon}
          </div>
          <span className="text-xs text-txt-dim font-medium uppercase tracking-wider">{c.label}</span>
          <span className={`text-[26px] font-bold font-mono tracking-tight leading-none ${c.valueClass}`}>{c.value}</span>
          {c.sub && <span className="text-xs text-txt-dim font-medium">{c.sub}</span>}
        </div>
      ))}
    </div>
  );
}
