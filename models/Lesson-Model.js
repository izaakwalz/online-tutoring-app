const mongoose = require('mongoose');

const lesson_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a lesson name'],
    trim: true,
  },
  time_start: {
    type: Date,
    required: [true, 'Please enter starting time'],
  },
  time_end: { Date },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tutor',
    required: true,
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'material',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Lesson = mongoose.model('lesson', lesson_schema);

module.exports = Lesson;
