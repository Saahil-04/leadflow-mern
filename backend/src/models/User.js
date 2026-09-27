const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  brokerageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brokerage',
    required: true,
    index: true, 
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['platform_admin', 'brokerage_admin', 'advisor', 'client'],
    default: 'advisor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index: email is unique WITHIN a brokerage, not globally
userSchema.index({ brokerageId: 1, email: 1 }, { unique: true });

 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);