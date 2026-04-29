const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'waitlist'], default: 'pending' },
  specialRequests: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
