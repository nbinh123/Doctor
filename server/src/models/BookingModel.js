const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },

  date: {
    type: String, // "2026-04-25"
    required: true
  },

  time: {
    type: String, // "09:00"
    required: true
  },

  mode: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },

  patientName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  note: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },

  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PAID', 'FAILED'],
    default: 'UNPAID'
  }

}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);