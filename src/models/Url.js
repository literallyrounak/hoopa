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
    // Optional custom alias the user chose instead of a random code
    isCustomAlias: {
      type: Boolean,
      default: false,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    // If set, the link stops redirecting after this date
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      // Placeholder for when auth is added later - not enforced yet
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// A link is "expired" if expiresAt is set and in the past
urlSchema.methods.isExpired = function () {
  return Boolean(this.expiresAt) && this.expiresAt.getTime() < Date.now();
};

module.exports = mongoose.model('Url', urlSchema);
