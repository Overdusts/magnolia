const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = 'https://openapi.blofin.com';

function createSignature(requestPath, method, timestamp, nonce, body, secret) {
  const prehash = requestPath + method + timestamp + nonce + body;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(prehash);
  const hexDigest = hmac.digest('hex');
  return Buffer.from(hexDigest).toString('base64');
}

function getHeaders(method, requestPath, body = '') {
  const apiKey = process.env.BLOFIN_API_KEY;
  const apiSecret = process.env.BLOFIN_API_SECRET;
  const passphrase = process.env.BLOFIN_PASSPHRASE;

  const timestamp = Date.now().toString();
  const nonce = uuidv4();
  const signature = createSignature(requestPath, method, timestamp, nonce, body, apiSecret);

  return {
    'ACCESS-KEY': apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-NONCE': nonce,
    'ACCESS-PASSPHRASE': passphrase,
    'Content-Type': 'application/json',
  };
}

async function request(method, path, params = {}) {
  let requestPath = path;
  let body = '';

  if (method === 'GET' && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    requestPath = `${path}?${qs}`;
  } else if (method === 'POST') {
    body = JSON.stringify(params);
  }

  const headers = getHeaders(method, requestPath, body);

  const config = {
    method,
    url: `${BASE_URL}${requestPath}`,
    headers,
  };

  if (method === 'POST' && body) {
    config.data = body;
  }

  const response = await axios(config);
  return response.data;
}

async function getBalance() {
  return request('GET', '/api/v1/account/balance');
}

async function getPositions() {
  return request('GET', '/api/v1/account/positions');
}

async function getTradeHistory() {
  return request('GET', '/api/v1/trade/fills', { limit: '50' });
}

async function getOrderHistory() {
  return request('GET', '/api/v1/trade/orders-history', { limit: '50' });
}

module.exports = { getBalance, getPositions, getTradeHistory, getOrderHistory };
