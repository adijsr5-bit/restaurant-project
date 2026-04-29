const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const HomeImage = require('../models/HomeImage');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hero-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all home images
router.get('/', async (req, res) => {
  try {
    const images = await HomeImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a new home image
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const newImage = await HomeImage.create({ imageUrl, title, subtitle });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a home image
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await HomeImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
