const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    isCustomAlias: {
      type: Boolean,
      default: false,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

urlSchema.methods.isExpired = function () {
  return Boolean(this.expiresAt) && this.expiresAt.getTime() < Date.now();
};

module.exports = mongoose.model('Url', urlSchema);
