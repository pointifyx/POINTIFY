const mongoose = require('mongoose');

const retailTrackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  remainingBalance: {
    type: Number,
    required: true
  },
  supplierName: String,
  dateTaken: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'partial', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('RetailTrack', retailTrackSchema);