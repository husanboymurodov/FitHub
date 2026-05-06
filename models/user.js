const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashed = await bcrypt.hash(this.password, 12);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// Static method for login
userSchema.statics.findAndValidate = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) return false;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
