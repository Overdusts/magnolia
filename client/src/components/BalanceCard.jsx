import React from 'react';

function fmt(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function BalanceCard({ balance }) {
  if (!balance) {
    return (
      <div className="balance-section">
        <div className="balance-hero">
          <div className="balance-hero-label">Total Equity</div>
          <div className="balance-hero-value">$0.00</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No balance data available</p>
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

  return (
    <div className="balance-section">
      <div className="balance-hero">
        <div className="balance-hero-label">Total Equity</div>
        <div className="balance-hero-value">${fmt(totalEquity)}</div>
        <div className="balance-details-grid">
          <div className="balance-detail">
            <div className="detail-label">Isolated Equity</div>
            <div className="detail-value">${fmt(isolatedEquity)}</div>
          </div>
          <div className="balance-detail">
            <div className="detail-label">Available</div>
            <div className="detail-value">${fmt(totalAvailable)}</div>
          </div>
          <div className="balance-detail">
            <div className="detail-label">Frozen</div>
            <div className="detail-value">${fmt(totalFrozen)}</div>
          </div>
          <div className="balance-detail">
            <div className="detail-label">Unrealized PnL</div>
            <div className={`detail-value ${totalUPnl >= 0 ? 'profit' : 'loss'}`}>
              {totalUPnl >= 0 ? '+' : ''}{fmt(totalUPnl)}
            </div>
          </div>
        </div>
      </div>

      <div className="currency-breakdown">
        <div className="card-header">
          <h2 className="card-title">
            Currency Breakdown
            <span className="badge">{details.length}</span>
          </h2>
        </div>
        <div className="currency-list">
          {details.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">$</div>
              No currencies found
            </div>
          ) : (
            details.map((d, i) => {
              const upnl = parseFloat(d.isolatedUnrealizedPnl) || 0;
              return (
                <div key={i} className="currency-item">
                  <div className="currency-left">
                    <div className="currency-icon">{(d.currency || '?').slice(0, 3)}</div>
                    <div>
                      <div className="currency-name">{d.currency}</div>
                      <div className="currency-sub">
                        Available: {fmt(d.available)}
                      </div>
                    </div>
                  </div>
                  <div className="currency-right">
                    <div className="currency-balance mono">{fmt(d.balance)}</div>
                    <div className={`currency-usd ${upnl >= 0 ? 'profit' : 'loss'}`}>
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
