const mongoose = require('mongoose');

const HomeImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HomeImage', HomeImageSchema);
