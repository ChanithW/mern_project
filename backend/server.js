const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const userController = require("./controller/userController");
const router = require("./Routes/ODMdrive");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, { cors: { origin: "*" } }); // Attach WebSocket

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// User API Routes
app.get("/api/users", userController.getAllUsers);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

// Order & Delivery Routes
app.use("/drive", router);

// Real-Time Tracking Logic
let devices = {}; // Store connected devices and locations

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendLocation", (data) => {
    devices[socket.id] = data;
    console.log("Device Location Updated:", data);

    // Broadcast location updates to all clients
    io.emit("updateLocations", devices);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete devices[socket.id];
    io.emit("updateLocations", devices);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running with tracking enabled...");
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
