const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'agent', 'admin', 'cashier', 'manager', 'stock_keeper', 'accountant', 'owner'],
    default: 'customer'
  },
  currency: {
    type: String,
    enum: ['USD', 'KSH', 'UGX', 'SOSH'],
    default: 'USD'
  },
  deviceID: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  shopName: String,
  email: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);