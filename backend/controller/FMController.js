const Finance = require("../model/FMmodel");
const fs = require("fs");
const { Parser } = require("json2csv");

exports.getAllRecords = async (req, res) => {
  try {
    const records = await Finance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addRecord = async (req, res) => {
  try {
    const { date, name, type, value } = req.body;
    const newRecord = new Finance({ date, name, type, value });
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully", newRecord });
  } catch (error) {
    res.status(400).json({ message: "Error adding record", error });
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
