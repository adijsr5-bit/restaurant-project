const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  notes: { type: String }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  orderType: { type: String, enum: ['walk-in', 'dine-in'], required: true },
  tableNumber: { type: String },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
