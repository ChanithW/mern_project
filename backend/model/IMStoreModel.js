const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IMStoreModel = new Schema({
    Date: {
        type: Date,
        required: true,
        unique: true // Ensure only one record per date
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0 // Ensure amount is not negative
    },
    notification: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true // Add createdAt and updatedAt fields
});

// Add index on Date field for faster queries
IMStoreModel.index({ Date: 1 }, { unique: true });

module.exports = mongoose.model("IMStore", IMStoreModel);