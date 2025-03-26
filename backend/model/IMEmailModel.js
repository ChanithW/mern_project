const mongoose = require("mongoose");
//const { Message } = require("twilio/lib/twiml/MessagingResponse");
const Schema = mongoose.Schema;

const IMEmailModel = new Schema({
    Email:{
        type: String,
        required: true, //validate
    },
    Message:{
        type: String,
        required: true, //Validate
    }
});

module.exports = mongoose.model("IMEmail", IMEmailModel)