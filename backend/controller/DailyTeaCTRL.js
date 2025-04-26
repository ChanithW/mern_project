const DailyTeaModel = require("../model/DailyTeaModel");
const EMregistermodel = require("../model/EMregistermodel");

// To add daily tea and wages
const addDailyTea = async (req, res, next) => {
  const { employeeId, dailyKg, dailyWages } = req.body;

  try {
    // Check emp in the db
    const employee = await EMregistermodel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // create new tea records 
    const dailyTea = new DailyTeaModel({ employeeId, dailyKg, dailyWages });
    await dailyTea.save();

    return res.status(201).json({ dailyTea });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add daily tea record" });
  }
};

// get all tea record
const getDailyTea = async (req, res, next) => {
  try {
    const dailyTeaRecords = await DailyTeaModel.find().populate("employeeId");
    return res.status(200).json({ dailyTeaRecords });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch daily tea records" });
  }
};

// get tea record to empid
const getDailyTeaByEmployeeId = async (req, res, next) => {
  const employeeId = req.params.employeeId;

  try {
    const dailyTeaRecords = await DailyTeaModel.find({ employeeId }).populate("employeeId");
    return res.status(200).json({ dailyTeaRecords });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch daily tea records" });
  }
};

module.exports = {
  addDailyTea,
  getDailyTea,
  getDailyTeaByEmployeeId,
};