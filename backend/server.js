const express = require('express');
const connectDB = require('./database/db');
const router = require("./routes/IMStoreRouter");
const routerdisptcher = require("./routes/IMDispatchRouter");
require('dotenv').config();

const cors = require("cors");
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");

const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Debug log for financeController
console.log("financeController:", financeController);

// Connect to MongoDB
connectDB();

//chanith - admin & users
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

//IM - Amath
app.use(express.json());
app.use("/tstock", router);
//IM DS - Amath
app.use(express.json());
app.use("/tdispatch", routerdisptcher);

//chim-schedules
app.post("/api/createschedule", fdmController.createSchedule);
app.get("/api/getschedules", fdmController.getSchedules);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id", fdmController.deleteSchedule);
app.get("/api/schedules/:id", fdmController.getScheduleById);

//chim-records
app.post("/api/createdrecord", fdmdController.createRecord);
app.get("/api/getrecords", fdmdController.getRecords);
app.get("/api/getrecord/:id", fdmdController.getRecordById);
app.put("/api/updaterecord/:id", fdmdController.updateRecord);
app.delete("/api/deleterecord/:id", fdmdController.deleteRecord);

//finance management - chanith
app.get("/api/finance", financeController.getAllFinanceRecords || ((req, res) => res.status(500).json({ message: "getAllFinanceRecords not found" })));
app.get("/api/finance/download", financeController.downloadReport || ((req, res) => res.status(500).json({ message: "downloadReport not found" })));
app.get("/api/finance/:id", financeController.getFinanceRecordById || ((req, res) => res.status(500).json({ message: "getFinanceRecordById not found" })));
app.post("/api/finance", upload.single('image'), financeController.addFinanceRecord);
app.put("/api/finance/:id", upload.single('image'), financeController.updateFinanceRecord);
app.delete("/api/finance/:id", financeController.deleteFinanceRecord);

app.listen(PORT, () => {
  console.log(`Server running on port. ${PORT}`);
});