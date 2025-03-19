const express = require('express');
const connectDB = require('./database/db'); // Import the DB connection
require('dotenv').config(); 

const cors = require("cors");
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;


// Connect to MongoDB (only once)
connectDB();

//chan
app.get("/api/users", userController.getAllUsers);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

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








app.listen(PORT, () => {
  console.log(`Server running on port. ${PORT}`);
});
