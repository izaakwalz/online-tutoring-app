const mongoose = require('mongoose');

const lesson_schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson name'],
    trim: true,
  },
  tutorId: {
    type: String,
    required: [true, 'Please provide a tutor email'],
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value); //? email validation
      },
      message: 'Please Enter a valid email',
    },
  },
  subject: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['primary', 'jss', 'sss'],
    message: 'Category is either: primary, jss, sss',
    require: true,
  },
  dataUrl: {
    type: String, // url link to file https://whatever.com
    required: [true, 'please enter url '],
  },
  timeStart: {
    type: Date,
    required: [true, 'Please enter starting time'],
    min: [Date.now, 'Date and time must be in advanced'],
  },
  timeEnd: {
    type: Date,
    required: [true, 'Please enter starting time'],
    min: [Date.now, 'Date and time must be in advanced'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

Lesson = mongoose.model('lesson', lesson_schema);

module.exports = Lesson;
