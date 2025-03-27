const IMDispatchModel = require("../model/IMDispatchModel");
//View on postman
const getDispatch = async (req, res, next) =>{
    let TDispatch;

    try{
        tDispatch = await IMDispatchModel.find();
    }catch (err) {
        console.log(err);
    }
    //If not fount
    if(!tDispatch){
        return res.status(404).json({message:"Dispatch didn't found"});
    }
    //Display
    return res.status(200).json({tDispatch});
}
//Data Insert
const addDispatch = async (req, res, next) =>{

    const {StockId, Date, Qty, Driver, Location} = req.body;

    let tDispatch;

    try{
        tDispatch = new IMDispatchModel({StockId, Date, Qty, Driver, Location});
        await tDispatch.save();
    }catch(err){
        console.log(err);
    }
    //If not inserted
    if(!tDispatch){
        return res.status(404).json({message:"unable to dispatch stock"});
    }
    return res.status(200).json({tDispatch});
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let tDispatch;

    try{
        tDispatch = await IMDispatchModel.findById(id);
    }catch (err) {
        console.log(err);
    }
    //If not available
    if(!tDispatch){
        return res.status(404).json({message:"Dipatched stock not found"});
    }
    return res.status(200).json({tDispatch});
}

//Update
const updateDispatch = async (req, res, next) => {
    const id = req.params.id;
    const {StockId, Date, Qty, Driver, Location} = req.body;

    let tDispatch;

    try{
        tDispatch = await IMDispatchModel.findByIdAndUpdate(id, {StockId: StockId, Date: Date, Qty: Qty, Driver: Driver, Location: Location});
        tDispatch = await tDispatch.save();
    }catch(err) {
        console.log(err);
    }
    //If not available
    if(!tDispatch){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({tDispatch});

}

//delete
const deleteDispatch = async (req, res, next) => {
    const id = req.params.id;

    let tDispatch;

    try{
        tDispatch = await IMDispatchModel.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //If not available
    if(!tDispatch){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({tDispatch});
}
exports.getDispatch = getDispatch;
exports.addDispatch = addDispatch;
exports.getById = getById;
exports.updateDispatch = updateDispatch;
exports.deleteDispatch = deleteDispatch;