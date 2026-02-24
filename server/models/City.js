const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

module.exports = mongoose.model('City', citySchema);

