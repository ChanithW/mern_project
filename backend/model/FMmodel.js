const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  value: { type: Number, required: true },
});

const Finance = mongoose.model("Finance", financeSchema);
module.exports = Finance;


