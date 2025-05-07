const express = require('express');
const connectDB = require('./database/db'); // Import DB connection
const routerIM = require("./routes/IMStoreRouter");
const routerdisptcher = require("./routes/IMDispatchRouter");
require('dotenv').config();
const EMregisterroutes = require("./routes/EMregisterroutes");
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");
const attendanceRoutes = require("./routes/AttendenceRouts");
const routeremail = require("./routes/emailRoutes");
require('dotenv').config(); // Load environment variables
const EMregisterroutes = require("./routes/EMregisterroutes");
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");
const attendanceRoutes = require("./routes/AttendenceRouts");
const router = require("./Routes/ODMdrive");
const PORT = process.env.PORT || 5000;


const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');


const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");
const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

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




const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date
  },
  locationHistory: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }]
});
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// --- Vehicle Tracking REST APIs ---
app.post('/api/vehicles', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = new Vehicle({ vehicleId });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- WebSocket: Real-time Tracking ---
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('updateLocation', async (data) => {
    try {
      const { vehicleId, lat, lng } = data;
      const timestamp = new Date();

      const vehicle = await Vehicle.findOne({ vehicleId });
      if (vehicle) {
        vehicle.lastLocation = { lat, lng, timestamp };
        vehicle.locationHistory.push({ lat, lng, timestamp });

        if (vehicle.locationHistory.length > 1000) {
          vehicle.locationHistory = vehicle.locationHistory.slice(-1000);
        }

        await vehicle.save();

        io.emit('locationUpdate', {
          vehicleId,
          location: { lat, lng, timestamp }
        });
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});




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

//IM - Amath
app.use("/tstock", routerIM);
//IM DS - Amath
app.use("/tdispatch", routerdisptcher);
//IM sms - Amath
app.use("/api/email", routeremail);

//chim-schedules
//app.use(smsRoutes);

// Field Management Schedules
app.post("/api/createschedule", fdmController.createSchedule);
app.get("/api/getschedules", fdmController.getSchedules);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id", fdmController.deleteSchedule);
app.get("/api/schedules/:id", fdmController.getScheduleById);

//chim-records
// Field Management Daily Records
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
