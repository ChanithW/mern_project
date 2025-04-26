const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeaPluckingSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EMregister',
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    kgPlucked: {
        type: Number,
        required: true
    },
    dailyWage: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("TeaPlucking", TeaPluckingSchema);