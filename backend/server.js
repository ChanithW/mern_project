const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require("http");
const socketIo = require("socket.io");

const connectDB = require('./database/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middleware
app.use(express.json());
app.use(cors());

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// ------------------------
// Controllers & Routes
// ------------------------
const userController = require("./controller/userController");
const fdmController = require("./controller/FDMfScheduleController");
const fdmdController = require("./controller/FDMdRecordsController");
const financeController = require("./controller/FMController");

const authRoutes = require('./routes/authRoutes');
const routerIM = require("./routes/IMStoreRouter");
const routerDispatcher = require("./routes/IMDispatchRouter");
const routerEmail = require("./routes/emailRoutes");
const EMregisterRoutes = require("./routes/EMregisterroutes");
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");
const attendanceRoutes = require("./routes/AttendenceRouts");
const ODMrouter = require("./Routes/ODMdrive");

// ------------------------
// API Routes
// ------------------------

// Auth
app.use('/api/auth', authRoutes);

// Users
app.get("/api/users", userController.getAllUsers);
app.get("/api/users/:id", userController.getUserById);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

// Inventory Management
app.use("/tstock", routerIM);
app.use("/tdispatch", routerDispatcher);
app.use("/api/email", routerEmail);

// Field Management - Schedules
app.post("/api/createschedule", fdmController.createSchedule);
app.get("/api/getschedules", fdmController.getSchedules);
app.get("/api/schedules/:id", fdmController.getScheduleById);
app.put("/api/updateschedule/:id", fdmController.updateSchedule);
app.delete("/api/schedules/:id", fdmController.deleteSchedule);

// Field Management - Daily Records
app.post("/api/createdrecord", fdmdController.createRecord);
app.get("/api/getrecords", fdmdController.getRecords);
app.get("/api/getrecord/:id", fdmdController.getRecordById);
app.put("/api/updaterecord/:id", fdmdController.updateRecord);
app.delete("/api/deleterecord/:id", fdmdController.deleteRecord);

// Finance Management
app.get("/api/finance", financeController.getAllFinanceRecords);
app.get("/api/finance/download", financeController.downloadReport);
app.get("/api/finance/:id", financeController.getFinanceRecordById);
app.post("/api/finance", upload.single('image'), financeController.addFinanceRecord);
app.put("/api/finance/:id", upload.single('image'), financeController.updateFinanceRecord);
app.delete("/api/finance/:id", financeController.deleteFinanceRecord);

// Employee Management
app.use("/employee", EMregisterRoutes);
app.use("/tea-plucking", teaPluckingRoutes);
app.use("/attendance", attendanceRoutes);

// Order & Delivery Management
app.use("/drive", ODMrouter);

// ------------------------
// Vehicle Tracking (MongoDB + Socket.IO)
// ------------------------
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

// REST APIs for vehicles
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

// Real-time location tracking
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

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ------------------------
// Root Endpoint
// ------------------------
app.get("/", (req, res) => {
  res.send("Server is running with tracking enabled...");
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
