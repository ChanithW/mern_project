const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IMDispatchModel = new Schema({
    StockId:{
        type: String,
        required: true, //validate
    },
    Date:{
        type: Date,
        required: true, //Validate
    },
    Qty:{
        type:Number,
        required: true, //Validate
    },
    Driver:{
        type:String,
        required:true, //Validate
    },
    Location:{
        type:String,
        required:true, //Validate
    }
});

module.exports = mongoose.model("IMDispatchModel", IMDispatchModel)