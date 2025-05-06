const mongoose = require("mongoose");

const FDMdRecordSchema = new mongoose.Schema({
  foundDate: { type: Date, required: true },
  diseaseName: { type: String, required: true },
  spreadStatus: { type: String, enum: ["Low", "Moderate", "High"], required: true },
  spreadArea:{ type: String, required: true },
  treatments: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ["Ongoing", "Resolved", "Under Monitoring"], required: true }
});

const FDMdRecord = mongoose.model("FDMdRecord", FDMdRecordSchema);

module.exports = FDMdRecord;
