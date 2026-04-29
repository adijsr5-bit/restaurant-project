const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all bookings (Admin/Staff)
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged in user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a booking
router.post('/', async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);
    
    // Emit socket event to notify staff
    const io = req.app.get('io');
    if (io) {
      io.emit('new_booking', newBooking);
    }

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Emit socket event to notify user
    const io = req.app.get('io');
    if (io) {
      io.emit('booking_updated', booking);
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
