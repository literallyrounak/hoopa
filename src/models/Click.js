const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  referrer: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  },
  deviceType: {
    type: String,
    default: 'unknown',
  },
});

module.exports = mongoose.model('Click', clickSchema);
