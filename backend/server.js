const express = require('express');
const connectDB = require('./database/db'); // Import DB connection
const router = require("./routes/IMStoreRouter");
const routerdisptcher = require("./routes/IMDispatchRouter");
require('dotenv').config(); // Load environment variables
const connectDB = require('./database/db'); // Import the DB connection
const EMregisterroutes = require("./routes/EMregisterroutes"); //Tuda emp
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");//tuda tea rec




const cors = require("cors");
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;


// Connect to MongoDB (only once)
connectDB();

//chanith - admin & users
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id",userController.getUserById)
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

//IM - Amath
app.use(express.json());
app.use("/tstock",router);
//IM DS - Amath
app.use(express.json());
app.use("/tdispatch", routerdisptcher);


//chim-schedules
app.post("/api/createschedule",fdmController.createSchedule);
app.get("/api/getschedules",fdmController.getSchedules);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id",fdmController.deleteSchedule);
app.get("/api/schedules/:id",fdmController.getScheduleById)

//chim-records
app.post("/api/createdrecord",fdmdController.createRecord);
app.get("/api/getrecords",fdmdController.getRecords);
app.get("/api/getrecord/:id", fdmdController.getRecordById); // Fetch one record
app.put("/api/updaterecord/:id", fdmdController.updateRecord); // Update record
app.delete("/api/deleterecord/:id", fdmdController.deleteRecord);


//finance management - chanith
app.get("/api/finance", financeController.getAllFinanceRecords);
app.get("/api/finance/download", financeController.downloadReport);//for report download
app.get("/api/finance/:id", financeController.getFinanceRecordById); // to fetch one rec by id
app.post("/api/finance", financeController.addFinanceRecord);
app.put("/api/finance/:id", financeController.updateFinanceRecord);
app.delete("/api/finance/:id", financeController.deleteFinanceRecord);

app.listen(PORT, () => {
  console.log(`Server running on port. ${PORT}`);
});
//EM - tuda
app.use(express.json());
app.use("/EMployee",EMregisterroutes);
//tea-plucking
app.use(express.json());
app.use("/tea-plucking", teaPluckingRoutes); //Tea plucking roouter



const attendanceRoutes = require("./routes/AttendenceRouts");
app.use("/attendance", attendanceRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
