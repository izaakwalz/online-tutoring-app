const mongoose = require('mongoose');

const stundentsSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please enter first name'],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, 'Please enter last name name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: 'Please Enter a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at leats 6 characters long'],
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ['primary', 'jss', 'sss'],
      message: 'Category is either: primary, jss, sss',
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Stundents = mongoose.model('stundent', stundentsSchema);

module.exports = Stundents;
