const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'AdityaDine' },
  logoUrl: { type: String, default: '' },
  themeColor: { type: String, default: '#e11d48' },
  address: { type: String, default: '123 Main St, City' },
  contactEmail: { type: String, default: 'info@adityadine.com' },
  contactPhone: { type: String, default: '+1234567890' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
