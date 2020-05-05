const mongoose = require('mongoose');

const subject_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subject name'],
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ['primary', 'jss', 'sss'],
      message: 'Category is either: primary, jss, sss',
      require: true,
    },
  },
  material: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'material',
      required: true,
    },
  ],
});

const Subject = mongoose.model('subject', subject_schema);

module.exports = Subject;
