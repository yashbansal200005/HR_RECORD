const mongoose = require('mongoose');

const hrRecordSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyProfileLink: {
    type: String,
    trim: true,
    default: ''
  },
  hrName: {
    type: String,
    required: true,
    trim: true
  },
  hrProfileLink: {
    type: String,
    trim: true,
    default: ''
  },
  hrEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  hrPhone: {
    type: String,
    trim: true,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HRRecord', hrRecordSchema);

