const mongoose = require('mongoose');

const subject_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subject name'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['primary', 'jss', 'sss'],
    message: 'Category is either: primary, jss, sss',
    require: true,
  },
  data_url: [
    {
      type: String, // url link to (pdf)s or video
      required: true,
      unique: true,
    },
  ],
});

const Subject = mongoose.model('subject', subject_schema);

module.exports = Subject;
