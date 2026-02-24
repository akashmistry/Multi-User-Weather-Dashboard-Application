const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, (req, res) => {
  res.json({ success: true, userId: req.userId });
});

module.exports = router;
