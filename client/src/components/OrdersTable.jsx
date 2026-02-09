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
  const d = new Date(parseInt(ts));
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getSymbol(instId) {
  if (!instId) return '?';
  return instId.split('-')[0];
}

function formatState(state) {
  if (!state) return '—';
  return state.replace(/_/g, ' ');
}

export default function OrdersTable({ orders }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Order History
          <span className="badge">{orders.length}</span>
        </h2>
      </div>
      <div className="card-body">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">~</div>
            No order history
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Instrument</th>
                  <th>Side</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>Filled</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const side = order.side;
                  const sideClass = side === 'buy' ? 'buy' : 'sell';
                  const stateClass = (order.state || '').toLowerCase().replace(/ /g, '_');

                  return (
                    <tr key={order.orderId || i}>
                      <td className="mono">{formatTime(order.createTime || order.cTime)}</td>
                      <td>
                        <div className="inst-cell">
                          <div className="inst-icon">{getSymbol(order.instId).slice(0, 2)}</div>
                          <span className="inst-name mono">{order.instId}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`side-chip ${sideClass}`}>{side}</span>
                      </td>
                      <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                        {order.orderType || '—'}
                      </td>
                      <td className="mono">{fmt(order.price, 4)}</td>
                      <td className="mono">{fmt(order.size, 4)}</td>
                      <td className="mono">{fmt(order.filledSize || order.accFillSz, 4)}</td>
                      <td>
                        <span className={`order-status ${stateClass}`}>
                          {formatState(order.state)}
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
    </div>
  );
}
