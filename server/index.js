require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err.message);
  const status = err.response?.status || 500;
  const message = err.response?.data?.msg || err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Magnolia server running on http://localhost:${PORT}`);
});
