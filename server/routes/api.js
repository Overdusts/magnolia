const express = require('express');
const router = express.Router();
const blofin = require('../blofin');

router.get('/balance', async (req, res, next) => {
  try {
    const result = await blofin.getBalance();
    if (result.code !== '0') {
      return res.status(400).json({ error: result.msg, code: result.code });
    }
    res.json(result.data);
  } catch (err) {
    next(err);
  }
});

router.get('/positions', async (req, res, next) => {
  try {
    const result = await blofin.getPositions();
    if (result.code !== '0') {
      return res.status(400).json({ error: result.msg, code: result.code });
    }
    res.json(result.data);
  } catch (err) {
    next(err);
  }
});

router.get('/trades', async (req, res, next) => {
  try {
    const result = await blofin.getTradeHistory();
    if (result.code !== '0') {
      return res.status(400).json({ error: result.msg, code: result.code });
    }
    res.json(result.data);
  } catch (err) {
    next(err);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const result = await blofin.getOrderHistory();
    if (result.code !== '0') {
      return res.status(400).json({ error: result.msg, code: result.code });
    }
    res.json(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
