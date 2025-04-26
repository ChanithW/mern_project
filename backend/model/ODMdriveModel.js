const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ODMdriveModel = new Schema({
    DeliveryID:{
        type: String,
        required: true, //Validate
    },
    TripDate:{
        type: Date,
        required: true, //validate
    },
    DepartureTime:{
        type: String,
        required: true, //Validate
    },
    VehicleNumber:{
        type: String,
        required: true, //Validate
    },
    StockID:{
        type: String,
        required: true, //Validate
    },
    FactoryLocation:{
        type: String,
        required: true, //Validate
    },
    EstimatedArrivalTime:{
        type: String,
        required: true, //Validate
    },
    ActualArrivalTime:{
        type: String,
        required: true, //Validate
    },
    Deliverystatus:{
        type: String,
        required: true, //Validate
    },
    DeliveryNotes:{
        type: String,
        required: true, //Validate
    },
    TraveledDistance:{
        type: String,
        required: true, //Validate
    },
    FuelConsumption:{
        type: String,
        required: true, //Validate
    }


});

module.exports = mongoose.model("ODMdrive",ODMdriveModel)