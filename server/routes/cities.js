const express = require('express');
const City = require('../models/City');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// GET /api/cities - get all cities for current user
router.get('/', async (req, res) => {
  try {
    const cities = await City.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// POST /api/cities - add a city for current user
router.post('/', async (req, res) => {
  try {
    const { name, countryCode } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'City name is required',
      });
    }

    const city = await City.create({
      user: req.userId,
      name: name.trim(),
      countryCode: countryCode ? countryCode.trim() : undefined,
    });

    res.status(201).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error('Create city error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;

