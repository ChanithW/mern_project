const ODMdriveModel = require("../model/ODMdriveModel");
//const ODMdriveModel = require("../model/ODMdriveModel");

const getdriver = async (req, res) => {
    try {
        const drive = await ODMdriveModel.find();
        if (!drive || drive.length === 0) {
            return res.status(404).json({ message: "No delivery found." });
        }
        return res.status(200).json({ drive });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
};


//Data Insert
const adddrive = async (req, res, next) =>{

    const {DeliveryID,TripDate,DepartureTime,VehicleNumber,StockID,FactoryLocation,EstimatedArrivalTime,ActualArrivalTime,Deliverystatus,DeliveryNotes,TraveledDistance,FuelConsumption} = req.body;

    let drive;

    try{
        drive = new ODMdriveModel({DeliveryID,TripDate,DepartureTime,VehicleNumber,StockID,FactoryLocation,EstimatedArrivalTime,ActualArrivalTime,Deliverystatus,DeliveryNotes,TraveledDistance,FuelConsumption});
        await drive.save();
    }catch(err){
        console.log(err);
    }
    //If not inserted
    if(!drive){
        return res.status(404).json({message:"unable to add details"});
    }
    return res.status(200).json({drive});
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let drive;

    try{
        drive = await ODMdriveModel.findById(id);
    }catch (err) {
        console.log(err);
    }
    //If not available
    if(!drive){
        return res.status(404).json({message:"details not found"});
    }
    return res.status(200).json({drive});
}

//Update
const updatedrive = async (req, res, next) => {
    const id = req.params.id;
    const {DeliveryID,TripDate,DepartureTime,VehicleNumber,StockID,FactoryLocation,EstimatedArrivalTime,ActualArrivalTime,Deliverystatus,DeliveryNotes,TraveledDistance,FuelConsumption} = req.body;

    let drive;

    try{
        drive = await ODMdriveModel.findByIdAndUpdate(id, {TripDate: TripDate, DepartureTime: DepartureTime, VehicleNumber: VehicleNumber, FactoryLocation: FactoryLocation, EstimatedArrivalTime: EstimatedArrivalTime, ActualArrivalTime: ActualArrivalTime, Deliverystatus: Deliverystatus, DeliveryNotes: DeliveryNotes, TraveledDistance: TraveledDistance, FuelConsumption: FuelConsumption});
        drive = await drive.save();
    }catch(err) {
        console.log(err);
    }
    //If not available
    if(!drive){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({drive});

}

//delete
const deletedrive = async (req, res, next) => {
    const id = req.params.id;

    let drive;

    try{
        drive = await ODMdriveModel.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //If not available
    if(!drive){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({drive});
}
exports.getdriver = getdriver;
exports.adddrive = adddrive;
exports.getById = getById;
exports.updatedrive = updatedrive;
exports.deletedrive = deletedrive;