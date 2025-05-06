const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/AttendenceController");

// Get all attendance records
router.get("/", attendanceController.getAllAttendance);

// Mark attendance
router.post("/", attendanceController.markAttendance);

// Get attendance by employee ID
router.get("/employee/:employeeId", attendanceController.getAttendanceByEmployeeId);

// Get attendance by ID
router.get("/:id", attendanceController.getAttendanceById);

// Update attendance
router.put("/:id", attendanceController.updateAttendance);

// Delete attendance
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;