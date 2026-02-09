# magnolia 🌸

Real-time BloFin portfolio dashboard. Displays your account balance, open positions, and trade history with live 5-second auto-refresh.

![Dark Terminal Theme](https://img.shields.io/badge/theme-dark%20terminal-0a0a0f?style=flat-square)
![BloFin API](https://img.shields.io/badge/exchange-BloFin-a78bfa?style=flat-square)
![React](https://img.shields.io/badge/frontend-React%2018-61dafb?style=flat-square)
![Express](https://img.shields.io/badge/backend-Express.js-000?style=flat-square)

## Features

- **Account Balance** — Total equity, available balance, frozen margin, unrealized PnL
- **Open Positions** — Instrument, side, size, entry/mark/liquidation price, leverage, uPnL
- **Trade History** — Recent fills with price, size, fee, and maker/taker role
- **Live Refresh** — Auto-updates every 5 seconds
- **Dark UI** — Trading terminal aesthetic with green/red PnL coloring

## Setup

### 1. Clone

```bash
git clone https://github.com/Overdusts/magnolia.git
cd magnolia
```

### 2. Install Dependencies

```bash
npm install
cd client && npm install && cd ..
```

### 3. Configure API Keys

Copy the example env file and fill in your BloFin API credentials:

```bash
cp .env.example .env
```

```env
BLOFIN_API_KEY=your_api_key
BLOFIN_API_SECRET=your_api_secret
BLOFIN_PASSPHRASE=your_passphrase
```

> **Note:** Only **Read** permission is required. The dashboard does not place trades.

### 4. Run

```bash
npm run dev
```

This starts both the Express backend (port 3001) and Vite dev server (port 5173).

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm start
```

Serves the built frontend from Express on port 3001.

## Project Structure

```
magnolia/
├── server/
│   ├── index.js              # Express server
│   ├── blofin.js             # BloFin API client (HMAC-SHA256 auth)
│   └── routes/
│       └── api.js            # REST endpoints
├── client/
│   ├── src/
│   │   ├── App.jsx           # Main app with 5s polling
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── PositionsTable.jsx
│   │   │   └── TradesTable.jsx
│   │   └── styles/
│   │       └── app.css
│   └── vite.config.js
├── .env.example
└── package.json
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/balance` | Account balance & equity |
| `GET /api/positions` | Open positions |
| `GET /api/trades` | Recent trade fills |
| `GET /api/orders` | Order history |

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Express.js + Axios
- **Auth:** HMAC-SHA256 request signing
- **Exchange:** BloFin OpenAPI v1

## License

MIT
