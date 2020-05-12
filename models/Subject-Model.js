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
  dataUrl: {
    type: String,
    required: [
      true,
      'please enter a data url, url must be a link: http://whatever.com',
    ],
  },
});

SubjectSchema.index({ name: 'text' });

const Subject = mongoose.model('subject', SubjectSchema);

module.exports = Subject;
