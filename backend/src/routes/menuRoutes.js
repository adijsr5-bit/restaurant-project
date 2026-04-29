const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save in backend/uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new menu item with image upload (Admin)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, dietary } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category,
      dietary,
      image: imageUrl
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a menu item (Admin)
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a menu item (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
