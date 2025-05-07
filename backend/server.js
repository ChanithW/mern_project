const express = require('express');
const connectDB = require('./database/db');
const router = require("./routes/IMStoreRouter");
const routerdisptcher = require("./routes/IMDispatchRouter");
const routeremail = require("./routes/emailRoutes");
require('dotenv').config(); // Load environment variables
const EMregisterroutes = require("./routes/EMregisterroutes"); // Employee routes
const teaPluckingRoutes = require("./routes/teaPluckingRoutes"); // Tea plucking routes
const attendanceRoutes = require("./routes/AttendenceRouts");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");
const ODMrouter = require("./Routes/ODMdrive");
const multer = require('multer');
const path = require('path');

// Initialize Express and HTTP server
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, { cors: { origin: "*" } }); // Attach WebSocket

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

// ------------------------
// API Routes
// ------------------------

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// User API Routes
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

// Inventory Management (Amath)
app.use("/tstock", router); // Stock routes
app.use("/tdispatch", routerdisptcher); // Dispatch routes
app.use("/api/email", routeremail); // Email routes

// Field Management (Chim)
app.post("/api/createschedule", fdmController.createSchedule);
app.get("/api/getschedules", fdmController.getSchedules);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id", fdmController.deleteSchedule);
app.get("/api/schedules/:id", fdmController.getScheduleById);

// Field Records (Chim)
app.post("/api/createdrecord", fdmdController.createRecord);
app.get("/api/getrecords", fdmdController.getRecords);
app.get("/api/getrecord/:id", fdmdController.getRecordById);
app.put("/api/updaterecord/:id", fdmdController.updateRecord);
app.delete("/api/deleterecord/:id", fdmdController.deleteRecord);

// Finance Management (Chanith)
app.get("/api/finance", financeController.getAllFinanceRecords);
app.get("/api/finance/download", financeController.downloadReport);
app.get("/api/finance/:id", financeController.getFinanceRecordById);
app.post("/api/finance", upload.single('image'), financeController.addFinanceRecord);
app.put("/api/finance/:id", upload.single('image'), financeController.updateFinanceRecord);
app.delete("/api/finance/:id", financeController.deleteFinanceRecord);

// Employee Management (Tuda)
app.use("/EMployee", EMregisterroutes);
app.use("/tea-plucking", teaPluckingRoutes); // Tea plucking routes
app.use("/attendance", attendanceRoutes); // Attendance routes

// Order & Delivery Management
app.use("/drive", ODMrouter);

// ------------------------
// Socket.IO (Real-Time Tracking)
// ------------------------
let devices = {}; // Store connected devices and locations

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendLocation", (data) => {
    devices[socket.id] = data;
    console.log("Device Location Updated:", data);
    io.emit("updateLocations", devices); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete devices[socket.id];
    io.emit("updateLocations", devices);
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running with tracking enabled...");
});

// ------------------------
// Start Server
// ------------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});