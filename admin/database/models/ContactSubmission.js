const mongoose = require('mongoose');

const ContactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  }
}, {
  timestamps: true
});

const ContactSubmission = mongoose.model('ContactSubmission', ContactSubmissionSchema);

module.exports = ContactSubmission;