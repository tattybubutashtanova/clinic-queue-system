const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    trim: true
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
  isAvailable: {
    type: Boolean,
    default: true
  },
  maxPatients: {
    type: Number,
    default: 4,
    min: 1,
    max: 10
  },
  currentBookings: {
    type: Number,
    default: 0,
    min: 0
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
timeSlotSchema.index({ department: 1, day: 1, time: 1 });
timeSlotSchema.index({ isAvailable: 1 });

// Ensure currentBookings doesn't exceed maxPatients
timeSlotSchema.pre('save', function(next) {
  if (this.currentBookings > this.maxPatients) {
    this.currentBookings = this.maxPatients;
    this.isAvailable = false;
  }
  next();
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
