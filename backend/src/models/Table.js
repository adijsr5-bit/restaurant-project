const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Table', TableSchema);
