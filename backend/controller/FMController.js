const Finance = require("../model/FMmodel");
const fs = require("fs");
const { Parser } = require("json2csv");


// Get all finance records
exports.getAllFinanceRecords = async (req, res) => {
  try {
    const records = await Finance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single finance record by ID
exports.getFinanceRecordById = async (req, res) => {
  try {
    const record = await Finance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error });
  }
};

// Add a new finance record
exports.addFinanceRecord = async (req, res) => {
  try {
    const { date, name, type, value } = req.body;
    const newRecord = new Finance({ date, name, type, value });
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully", newRecord });
  } catch (error) {
    res.status(400).json({ message: "Error adding record", error });
  }
};

//Update an existing finance record
exports.updateFinanceRecord = async (req, res) => {
  try {
    const updatedRecord = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record updated successfully", updatedRecord });
  } catch (error) {
    res.status(400).json({ message: "Error updating record", error });
  }
};

// Delete a finance record
exports.deleteFinanceRecord = async (req, res) => {
  try {
    const deletedRecord = await Finance.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const records = await Finance.find();
    const json2csvParser = new Parser({ fields: ["date", "name", "type", "value"] });
    const csv = json2csvParser.parse(records);
    
    res.header("Content-Type", "text/csv");
    res.attachment("Finance_Report.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
};
