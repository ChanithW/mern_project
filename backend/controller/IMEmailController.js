const IMEmailModel = require("../model/IMEmailModel");
//const IMstock = require("../model/IMStoreModel");
//View on postman
const getEmail = async (req, res, next) =>{
    let Email;

    try{
        email = await IMEmailModel.find();
    }catch (err) {
        console.log(err);
    }
    //If not fount
    if(!email){
        return res.status(404).json({message:"Email didn't found"});
    }
    //Display
    return res.status(200).json({email});
}
//Data Insert
const addEmail = async (req, res, next) =>{

    const {Email,Message} = req.body;

    let email;

    try{
        email = new IMEmailModel({Email,Message});
        await email.save();
    }catch(err){
        console.log(err);
    }
    //If not inserted
    if(!email){
        return res.status(404).json({message:"unable to send email"});
    }
    return res.status(200).json({email});
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let email;

    try{
        email = await IMEmailModel.findById(id);
    }catch (err) {
        console.log(err);
    }
    //If not available
    if(!email){
        return res.status(404).json({message:"Email not found"});
    }
    return res.status(200).json({email});
}

//Update
const updateEmail = async (req, res, next) => {
    const id = req.params.id;
    const {Email,Message} = req.body;

    let email;

    try{
        email = await IMEmailModel.findByIdAndUpdate(id, {Email: Email, Message: Message});
        email = await email.save();
    }catch(err) {
        console.log(err);
    }
    //If not available
    if(!email){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({email});

}

//delete
const deleteEmail = async (req, res, next) => {
    const id = req.params.id;

    let email;

    try{
        email = await IMEmailModel.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //If not available
    if(!email){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({email});
}
exports.getEmail = getEmail;
exports.addEmail = addEmail;
exports.getById = getById;
exports.updateEmail = updateEmail;
exports.deleteEmail = deleteEmail;