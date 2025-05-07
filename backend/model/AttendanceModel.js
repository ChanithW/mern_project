const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    hoursWorked: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'absent', 'leave'],
        default: 'pending'
    },
    note: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);