const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true }, // e.g., 'Starters', 'Main Course', 'Desserts'
  dietary: { type: String, enum: ['veg', 'non-veg', 'vegan'], default: 'veg' },
  tags: [{ type: String }], // e.g., 'spicy', 'popular'
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
