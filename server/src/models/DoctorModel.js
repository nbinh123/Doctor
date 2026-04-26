const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  avatar: {
    type: String, // link ảnh
    default: ''
  },

  specialty: {
    type: String,
    required: true,
    index: true
  },

  hospital: {
    type: String,
    default: ''
  },

  experience: {
    type: String, // "10 năm"
  },

  degree: {
    type: String, // bằng cấp
  },

  description: {
    type: String, // mô tả chi tiết
  },

  price: {
    type: Number,
    required: true
  },

  location: {
    type: String // địa chỉ
  },

  rating: {
    type: Number,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  },
  shedule: [
    {
      day: String, // "Monday", "Tuesday", ...
      timeSlots: [
        {
          start: String, // "09:00"
          end: String // "17:00"
        }
      ]
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);