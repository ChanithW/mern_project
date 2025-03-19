const FDMdRecord = require("../model/FDMdRecordsModel");

// Create a new disease record
exports.createRecord = async (req, res) => {
  try {
    const newRecord = new FDMdRecord(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating record" });
  }
};


// Get all disease records
exports.getRecords = async (req, res) => {
  try {
    const records = await FDMdRecord.find();
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while retrieving records" });
  }
};

// Get a single disease record by ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await FDMdRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while retrieving record" });
  }
};

// Update a disease record
exports.updateRecord = async (req, res) => {
  try {
    const updatedRecord = await FDMdRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record updated successfully", updatedRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating record" });
  }
};

// Delete a disease record
exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await FDMdRecord.findByIdAndDelete(req.params.id);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting record" });
  }
};




