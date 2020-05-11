const mongoose = require('mongoose');

const stundentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your full name'],
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
    min: 6,
    trim: true,
  },
  category: {
    type: String,
    enum: ['primary', 'jss', 'sss'],
    message: 'Category is either: primary, jss, sss',
    required: [true, 'please select a category'],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'lesson' }],
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Stundents = mongoose.model('stundent', stundentsSchema);

module.exports = Stundents;
