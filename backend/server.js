const express = require('express');
const connectDB = require('./database/db'); // Import the DB connection
const EMregisterroutes = require("./routes/EMregisterroutes"); //Tuda emp
const teaPluckingRoutes = require("./routes/teaPluckingRoutes");//tuda tea rec


require('dotenv').config(); // load environment variables

const cors = require("cors");
const userController = require("./controller/userController");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

// connect to MongoDB 
connectDB();

app.get("/api/users", userController.getAllUsers);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

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