const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IMStoreModel = new Schema({
    Date:{
        type: Date,
        required: true, //validate
    },
    totalAmount:{
        type: Number,
        required: true, //Validate
    }
});

module.exports = mongoose.model("IMStore", IMStoreModel)