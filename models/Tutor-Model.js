const mongoose = require('mongoose');

const tutor_schema = new mongoose.Schema({
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
    minlength: [6, 'Password must be at leats 6 characters long'],
    trim: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subject',
      required: true,
    },
  ],
  admin: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

tutor_schema.index({ name: 'text' });

const Tutor = mongoose.model('tutor', tutor_schema);

module.exports = Tutor;
