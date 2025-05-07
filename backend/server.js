const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require("http");
const socketIo = require("socket.io");
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const PDFDocument = require('pdfkit');

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

// Connect to MongoDB via connectDB
connectDB();

// MongoDB client for direct queries
let db;
MongoClient.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tea_management', { useUnifiedTopology: true })
  .then(client => {
    db = client.db('tea_management');
    console.log("Connected to MongoDB for payroll operations");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token." });
  }
};

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
app.get("/api/finance", authenticateToken, financeController.getAllFinanceRecords);
app.get("/api/finance/download", authenticateToken, financeController.downloadReport);
app.get("/api/finance/:id", authenticateToken, financeController.getFinanceRecordById);
app.post("/api/finance", authenticateToken, upload.single('image'), financeController.addFinanceRecord);
app.put("/api/finance/:id", authenticateToken, upload.single('image'), financeController.updateFinanceRecord);
app.delete("/api/finance/:id", authenticateToken, financeController.deleteFinanceRecord);

// Employee Management
app.use("/employee", EMregisterRoutes);
app.use("/tea-plucking", teaPluckingRoutes);
app.use("/attendance", attendanceRoutes);

// Order & Delivery Management
app.use("/drive", ODMrouter);

// ------------------------
// Payroll Management Routes
// ------------------------

// GET /api/payroll - Fetch all payroll records
app.get("/api/payroll", authenticateToken, async (req, res) => {
  try {
    const records = await db.collection("payroll").find().toArray();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payroll records" });
  }
});

// POST /api/payroll/add - Add a new payroll record
app.post("/api/payroll/add", authenticateToken, async (req, res) => {
  try {
    const { employeeId, employeeName, performanceLevel, paymentAmount, date, dailyWage } = req.body;
    const record = {
      employeeId,
      employeeName,
      performanceLevel,
      paymentAmount,
      date,
      dailyWage, // Include dailyWage in the payroll record
    };
    await db.collection("payroll").insertOne(record);
    res.status(201).json({ message: "Payroll record added", record });
  } catch (err) {
    res.status(500).json({ error: "Failed to add payroll record", details: err.message });
  }
});

// DELETE /api/payroll/:id - Delete a payroll record
app.delete("/api/payroll/:id", authenticateToken, async (req, res) => {
  try {
    await db.collection("payroll").deleteOne({ _id: req.params.id });
    res.json({ message: "Payroll record deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete payroll record" });
  }
});

// GET /api/employee/payment/:employeeId - Fetch employee name and daily wage from tea-plucking
app.get("/api/employee/payment/:employeeId", authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date } = req.query; // Expect date as a query parameter (e.g., 2025-05-07)

    if (!date) {
      return res.status(400).json({ error: "Date query parameter is required" });
    }

    const record = await db.collection("tea-plucking").findOne({
      employeeId: employeeId.toString(),
      date: { $regex: `^${date}` } // Match the date (e.g., starts with "2025-05-07")
    });

    if (!record) {
      return res.status(404).json({ error: "No tea plucking record found for this employee on the specified date" });
    }

    res.json({
      employeeName: record.employeeName,
      dailyWage: parseFloat(record.dailyWage) || 0
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employee data", details: err.message });
  }
});

// GET /api/payroll/download - Download PDF report
app.get("/api/payroll/download", authenticateToken, async (req, res) => {
  try {
    const records = await db.collection("payroll").find().toArray();
    const doc = new PDFDocument();
    const fileName = "Payroll_Report.pdf";
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Payroll Report", { align: "center" });
    doc.moveDown();
    records.forEach((record) => {
      doc.text(`Employee ID: ${record.employeeId}`);
      doc.text(`Name: ${record.employeeName}`);
      doc.text(`Performance Level: ${record.performanceLevel}`);
      doc.text(`Daily Wage: LKR ${record.dailyWage.toFixed(2)}`);
      doc.text(`Payment Amount: LKR ${record.paymentAmount.toFixed(2)}`);
      doc.text(`Date: ${record.date}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

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
