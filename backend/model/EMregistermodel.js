const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EMregistermodel = new Schema({
    employeeId:{
        type: String,
        required: true,
    },
    empType:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("EMregister", EMregistermodel)