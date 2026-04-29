const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/authMiddleware');

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({}); // Create default if none exists
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (Admin only)
router.put('/', protect, admin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (settings) {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await Setting.create(req.body);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
