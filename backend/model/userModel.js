const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: [
      "Owner",
      "Estate manager",
      "Inventory manager",
      "Supervisor",
      "Agricultural technician",
      "Finance officer",
      "Driver",
    ],
  },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
