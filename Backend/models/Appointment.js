const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  // Remove member and trainer references or make them optional
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: false // Change to false since form doesn't collect member ID
  },
  trainer: {
    type: String, // Change from ObjectId to String since you're not selecting trainers
    default: 'Available Trainer'
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  concerns: {  // ADD THIS FIELD for your form data
    type: [String],
    default: []
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to check if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  const appointmentDateTime = new Date(
    this.appointmentDate.toISOString().split('T')[0] + 'T' + this.endTime
  );
  return appointmentDateTime < new Date();
});

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;