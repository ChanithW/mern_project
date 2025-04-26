const express = require('express');
const connectDB = require('./database/db');
const router = require("./routes/IMStoreRouter");
const routerdisptcher = require("./routes/IMDispatchRouter");
require('dotenv').config();
const EMregisterroutes = require("./routes/EMregisterroutes");
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");
const attendanceRoutes = require("./routes/AttendenceRouts");
const routeremail = require("./routes/emailRoutes");


const cors = require("cors");
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// User Management
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

// Inventory Management
app.use("/tstock", router);
app.use("/tdispatch", routerdisptcher);
//IM sms - Amath
app.use(express.json());
app.use("/api/email", routeremail);
//app.use(smsRoutes);

// Field Management Schedules
app.post("/api/createschedule", fdmController.createSchedule);
app.get("/api/getschedules", fdmController.getSchedules);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id", fdmController.deleteSchedule);
app.get("/api/schedules/:id", fdmController.getScheduleById);

// Field Management Daily Records
app.post("/api/createdrecord", fdmdController.createRecord);
app.get("/api/getrecords", fdmdController.getRecords);
app.get("/api/getrecord/:id", fdmdController.getRecordById);
app.put("/api/updaterecord/:id", fdmdController.updateRecord);
app.delete("/api/deleterecord/:id", fdmdController.deleteRecord);

// Finance Management
app.get("/api/finance", financeController.getAllFinanceRecords);
app.get("/api/finance/download", financeController.downloadReport);
app.get("/api/finance/:id", financeController.getFinanceRecordById);
app.post("/api/finance", financeController.addFinanceRecord);
app.put("/api/finance/:id", financeController.updateFinanceRecord);
app.delete("/api/finance/:id", financeController.deleteFinanceRecord);

// Employee Registration
app.use("/EMployee", EMregisterroutes);

// Tea Plucking
app.use("/tea-plucking", teaPluckingRoutes);

// Attendance
app.use("/attendance", attendanceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
