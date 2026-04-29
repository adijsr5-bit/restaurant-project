const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new order (Checkout)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, customerDetails, orderType } = req.body;
    
    const orderData = {
      customerName: customerDetails?.name || 'Guest',
      tableNumber: customerDetails?.tableNumber,
      orderType: orderType || 'walk-in',
      items: items.map(i => ({ menuItem: i._id, quantity: i.quantity, price: i.price })),
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    };

    const newOrder = await Order.create(orderData);
    
    // Socket.io for admin notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
