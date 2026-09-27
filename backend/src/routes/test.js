const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/test/me
// This proves the middleware works: returns the current user's info
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Auth works!',
    user: req.user,
    brokerageId: req.brokerageId,
  });
});

module.exports = router;