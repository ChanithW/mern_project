const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyTeaSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EMregister",
        required: true,
    },
    
    date: {
        type: Date,
        default: Date.now,
    },
    
    dailyKg: {
        type: Number,
        required: true,
    },
    
    dailyWages: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("DailyTea", DailyTeaSchema);