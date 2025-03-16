const express = require('express');
const connectDB = require('./database/db'); // Import the DB connection
require('dotenv').config(); // Load environment variables

const cors = require("cors");
const userController = require("./controller/userController");

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (only once)
connectDB();

app.get("/api/users", userController.getAllUsers);
app.post("/api/users", userController.addUser);
app.put("/api/users/:id", userController.editUser);
app.delete("/api/users/:id", userController.deleteUser);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
