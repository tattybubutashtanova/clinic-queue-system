const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  timeSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  queueNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Waiting', 'In Progress', 'Completed'],
    default: 'Waiting'
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
patientSchema.index({ department: 1, day: 1, status: 1 });
patientSchema.index({ timeSlotId: 1 });
patientSchema.index({ queueNumber: 1 });

// Generate queue number before saving
patientSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const lastPatient = await this.constructor
      .findOne({ department: this.department, day: this.day })
      .sort({ queueNumber: -1 });
    
    this.queueNumber = lastPatient ? lastPatient.queueNumber + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Patient', patientSchema);
