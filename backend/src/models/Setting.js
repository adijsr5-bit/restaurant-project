const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'The Fig & Olive' },
  logoUrl: { type: String, default: '' },
  themeColor: { type: String, default: '#7b8c5a' },
  address: { type: String, default: '13-15 Castle Street, Douglas, IM1 2EX' },
  contactEmail: { type: String, default: 'contact@thefigandolive.com' },
  contactPhone: { type: String, default: '01624 626003' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
