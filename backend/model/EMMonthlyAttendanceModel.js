const mongoose = require("mongoose");

const monthlyAttendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String, // Change this to String
        required: true,
    },
    month: {
        type: Number, // 1 to 12
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    totalHoursWorked: {
        type: Number,
        default: 0,
    },
    totalDaysWorked: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("MonthlyAttendance", monthlyAttendanceSchema);
