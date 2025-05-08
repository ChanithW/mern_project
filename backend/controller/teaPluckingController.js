const TeaPluckingModel = require("../model/TeaPluckingModel");
const EMregistermodel = require("../model/EMregistermodel");

// get all tea records
const getAllRecords = async (req, res, next) => {
  let records;

  try {
    records = await TeaPluckingModel.find().sort({ date: -1 });
  } catch (err) {
    console.log(err);
  }

  // If no records found
  if (!records) {
    return res.status(404).json({ message: "Records didn't found" });
  }

  // Display records
  return res.status(200).json({ records });
};

// Get records by date
const getRecordsByDate = async (req, res, next) => {
  const { date } = req.params;
  let records;

  try {
    //create day range for a day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    records = await TeaPluckingModel.find({
      date: { $gte: startDate, $lte: endDate },
    });
  } catch (err) {
    console.log(err);
  }

  // If no records found
  if (!records) {
    return res.status(404).json({ message: "Records didn't found" });
  }

  return res.status(200).json({ records });
};

// Get all employees to dropdown
const getEmployeesForDropdown = async (req, res, next) => {
  let employees;

  try {
    employees = await EMregistermodel.find().select("_id name");
  } catch (err) {
    console.log(err);
  }

  // If no employees found
  if (!employees) {
    return res.status(404).json({ message: "Employees didn't found" });
  }

  return res.status(200).json({ employees });
};

const getNonPermanentEmployees = async (req, res, next) => {
  let employees;

  try {
    // filter emp type non permanant
    employees = await EMregistermodel.find({ empType: "non_permanent" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error fetching permanent employees" });
  }

  // If no permanent employees found
  if (!employees || employees.length === 0) {
    return res.status(404).json({ message: "No permanent employees found" });
  }

  // Return permanent employees
  return res.status(200).json({
    employees,
    count: employees.length,
  });
};

// Add new tea plucking record
const addRecord = async (req, res, next) => {
  const { employeeId, kgPlucked, dailyWage, date } = req.body;
  let newRecord;

  try {
    // Get employee name from employee ID
    const employee = await EMregistermodel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    newRecord = new TeaPluckingModel({
      employeeId,
      employeeName: employee.name,
      date: date || new Date(),
      kgPlucked,
      dailyWage,
    });

    await newRecord.save();
  } catch (err) {
    console.log(err);
  }

  // If record not inserted
  if (!newRecord) {
    return res.status(404).json({ message: "Unable to add record" });
  }

  return res.status(201).json({ record: newRecord });
};

// Update tea plucking record
const updateRecord = async (req, res, next) => {
  const { id } = req.params;
  const { employeeId, kgPlucked, dailyWage, date } = req.body;
  let updatedRecord;

  try {
    // If employee ID changed, get the new name
    let employeeName;
    if (employeeId) {
      const employee = await EMregistermodel.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      employeeName = employee.name;
    }

    updatedRecord = await TeaPluckingModel.findByIdAndUpdate(
      id,
      {
        ...(employeeId && { employeeId }),
        ...(employeeName && { employeeName }),
        ...(date && { date }),
        ...(kgPlucked !== undefined && { kgPlucked }),
        ...(dailyWage !== undefined && { dailyWage }),
      },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.log(err);
  }

  // If record not updated
  if (!updatedRecord) {
    return res.status(404).json({ message: "Unable to update record" });
  }

  return res.status(200).json({ record: updatedRecord });
};

// Delete tea plucking record
const deleteRecord = async (req, res, next) => {
  const { id } = req.params;
  let deletedRecord;

  try {
    deletedRecord = await TeaPluckingModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.log(err);
  }

  // If record not deleted
  if (!deletedRecord) {
    return res.status(404).json({ message: "Unable to delete record" });
  }

  return res.status(200).json({ message: "Record deleted successfully" });
};

const getRecordsByEmployeeId = async (req, res, next) => {
  const { employeeId } = req.params;
  let records;

  try {
    records = await TeaPluckingModel.find({ employeeId }).sort({ date: -1 });
  } catch (err) {
    console.log(err);
  }

  if (!records || records.length === 0) {
    return res
      .status(404)
      .json({ message: "No records found for this employee" });
  }

  return res.status(200).json({ records });
};

// get single tea plucking record by ID
const getRecordById = async (req, res, next) => {
  const { id } = req.params;
  let record;

  try {
    record = await TeaPluckingModel.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching record details." });
  }

  return res.status(200).json({ record });
};

// Regular async function (no useCallback needed in backend)
const fetchPayrollData = async (req, res) => {
  try {
    const records = await TeaPluckingModel.find().sort({ date: -1 });
    console.log("Payroll data response:", records);
    return res.status(200).json({ records });
  } catch (err) {
    console.error("Error fetching payroll data:", err);
    return res.status(500).json({
      message: err.response?.data?.message || "Failed to fetch payroll data",
    });
  }
};

module.exports = {
  getAllRecords,
  getRecordsByDate,
  getEmployeesForDropdown,
  addRecord,
  updateRecord,
  deleteRecord,
  getRecordsByEmployeeId,
  getRecordById,
  getNonPermanentEmployees,
  fetchPayrollData,
};