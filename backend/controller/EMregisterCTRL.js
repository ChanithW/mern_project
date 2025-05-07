const EMregistermodel = require("../model/EMregistermodel");

//view all emp
const getEM = async (req, res, next) =>{
    let Employee;

    try{
        employee = await EMregistermodel.find();
    }catch (err) {
        console.log(err);
    }
    //not found
    if(!employee){
        return res.status(404).json({message:"Employee didn't found"});
    }
    //display emp
    return res.status(200).json({employee});
}
//insert emp
const addEM = async (req, res, next) =>{

    const {employeeId,empType,name,age,address,gender,phoneNumber} = req.body;

    let employee;

    try{
        employee = new EMregistermodel({employeeId,empType,name,age,address,gender,phoneNumber});
        await employee.save();
    }catch(err){
        console.log(err);
    }
    //not insert
    if(!employee){
        return res.status(404).json({message:"unable to add an employee"});
    }
    return res.status(200).json({employee});
};

//get bu id
const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const employee = await EMregistermodel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ employee });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error fetching employee" });
    }
};
//update emp
const updateEM = async (req, res, next) => {
    const id = req.params.id;
    const {empType,name,age,address,gender,phoneNumber} = req.body;

    let employee;

    try{
        employee = await EMregistermodel.findByIdAndUpdate(id, {empType: empType, name: name, age: age, address: address, gender: gender, phoneNumber: phoneNumber});
        employee = await employee.save();
    }catch(err) {
        console.log(err);
    }
    //not available
    if(!employee){
        return res.status(404).json({message:"Unable to update"});
    }
    return res.status(200).json({employee});

}

//delete
const deleteEM = async (req, res, next) => {
    const id = req.params.id;

    let employee;

    try{
        employee = await EMregistermodel.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    //not available
    if(!employee){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({employee});
}



exports.getEM = getEM;
exports.addEM = addEM;
exports.getById = getById;
exports.updateEM = updateEM;
exports.deleteEM = deleteEM;
