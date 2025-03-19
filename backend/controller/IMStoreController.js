const IMStoreModel = require("../model/IMStoreModel");
//const IMstock = require("../model/IMStoreModel");
//View on postman
const getStore = async (req, res, next) =>{
    let TStock;

    try{
        tStock = await IMStoreModel.find();
    }catch (err) {
        console.log(err);
    }
    //If not fount
    if(!tStock){
        return res.status(404).json({message:"Stocks didn't found"});
    }
    //Display
    return res.status(200).json({tStock});
}
//Data Insert
const addStore = async (req, res, next) =>{

    const {Date,totalAmount} = req.body;

    let tStock;

    try{
        tStock = new IMStoreModel({Date,totalAmount});
        await tStock.save();
    }catch(err){
        console.log(err);
    }
    //If not inserted
    if(!tStock){
        return res.status(404).json({message:"unable to add stock"});
    }
    return res.status(200).json({tStock});
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let tStock;

    try{
        tStock = await IMStoreModel.findById(id);
    }catch (err) {
        console.log(err);
    }
    //If not available
    if(!tStock){
        return res.status(404).json({message:"Stock not found"});
    }
    return res.status(200).json({tStock});
}

//Update
const updateStore = async (req, res, next) => {
    const id = req.params.id;
    const {Date,totalAmount} = req.body;

    let tStock;

    try{
        tStock = await IMStoreModel.findByIdAndUpdate(id, {Date: Date, totalAmount: totalAmount});
        tStock = await tStock.save();
    }catch(err) {
        console.log(err);
    }
    //If not available
    if(!tStock){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({tStock});

}

//delete
const deleteStore = async (req, res, next) => {
    const id = req.params.id;

    let tStock;

    try{
        tStock = await IMStoreModel.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //If not available
    if(!tStock){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({tStock});
}
exports.getStore = getStore;
exports.addStore = addStore;
exports.getById = getById;
exports.updateStore = updateStore;
exports.deleteStore = deleteStore;