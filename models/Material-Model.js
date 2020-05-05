const mongoose = require('mongoose');

const material_schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subject',
    required: true,
  },
  data_url: {
    type: String,
    trim: true,
    required: [true, 'Material must have a link to file or video'],
  },
});

const Material = mongoose.model('material', material_schema);

module.exports = Material;
