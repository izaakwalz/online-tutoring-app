const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subject name'],
  },
  category: {
    type: String,
    enum: ['primary', 'jss', 'sss'],
    message: 'Category is either: primary, jss, sss',
    require: true,
  },
  dataUrl: [
    {
      type: String, // url link to (pdf)s or video
      required: true,
    },
  ],
});

const Subject = mongoose.model('subject', SubjectSchema);

module.exports = Subject;
