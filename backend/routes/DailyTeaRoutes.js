const express = require("express");
const router = express.Router();
const DailyTeaCTRL = require("../controller/DailyTeaCTRL");

// routes
router.post("/", DailyTeaCTRL.addDailyTea); // add daily tea
router.get("/", DailyTeaCTRL.getDailyTea); // get all daily tea 
router.get("/:employeeId", DailyTeaCTRL.getDailyTeaByEmployeeId); // get records by employee ID
router.get("/employees", DailyTeaCTRL.getEmployeesForDropdown);//get employee to the daily dropdown


module.exports = router;