const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendenceModel = new mongoose.Schema({
    employeeId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    checkInTime: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present'
    }
  });
  
  const Attendance = mongoose.model('Attendance', AttendenceModel);
  module.exports = Attendance;