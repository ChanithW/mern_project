const IMStoreModel = require("../model/IMStoreModel");
//View on postman
const getStore = async (req, res, next) => {
    try {
        const tStock = await IMStoreModel.find().sort({ Date: -1 });
        return res.status(200).json({ tStock });
    } catch (err) {
        console.error("Error fetching stocks:", err);
        return res.status(500).json({ 
            message: "Error fetching stocks",
            error: err.message 
        });
    }
};
// Data Insert
const addStore = async (req, res, next) => {
    const { date, totalAmount } = req.body;

    console.log("Received data:", { date, totalAmount });

    // Validate required fields
    if (!date || !totalAmount) {
        console.log("Missing required fields");
        return res.status(400).json({ 
            message: "Date and totalAmount are required",
            received: { date, totalAmount }
        });
    }

    // Validate totalAmount is a positive number
    if (isNaN(totalAmount) || Number(totalAmount) <= 0) {
        return res.status(400).json({ 
            message: "Total Amount must be a positive number",
            received: totalAmount
        });
    }

    try {
        // Format the date to start of day for comparison
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ 
                message: "Invalid date format",
                received: date
            });
        }
        dateObj.setHours(0, 0, 0, 0);

        // Check if a record already exists for this date
        const existingRecord = await IMStoreModel.findOne({
            Date: {
                $gte: dateObj,
                $lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingRecord) {
            console.log("Record already exists for date:", date);
            return res.status(400).json({ 
                message: "A record already exists for this date. Only one record per day is allowed." 
            });
        }

        // Create new stock record
        const tStock = new IMStoreModel({
            Date: dateObj,
            totalAmount: Number(totalAmount),
            notification: false
        });

        console.log("Attempting to save record:", tStock);

        // Save to database
        await tStock.save();

        console.log("Record saved successfully");

        // Return success response
        return res.status(201).json({ 
            message: "Stock added successfully",
            tStock 
        });
    } catch (err) {
        console.error("Detailed error adding stock:", err);
        if (err.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ 
                message: "A record already exists for this date. Only one record per day is allowed." 
            });
        }
        return res.status(500).json({ 
            message: "Error adding stock",
            error: err.message,
            stack: err.stack
        });
    }
};

// Fetch data where notification is false
const getStoresByNotification = async (req, res, next) => {
    let tStocks;

    try {
        tStocks = await IMStoreModel.find({ notification: false });
    } catch (err) {
        console.log(err);
    }
    // If not found
    if (!tStocks || tStocks.length === 0) {
        return res.status(404).json({ message: "No stocks found with notification set to false" });
    }
    return res.status(200).json({ tStocks });
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
exports.getStoresByNotification = getStoresByNotification;