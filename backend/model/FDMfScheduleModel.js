const mongoose = require("mongoose");

const FDMfScheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  fertilizerMixture: { type: String, required: true, enum: ["VP/Uva 945", "VP/Uva 1055", "VP/LC 880", "VP/LC 1075", "VP/UM 910", "VP/UM 1020"] },
  urea: { type: Number, required: true },
  erp: { type: Number, required: true },
  mop: { type: Number, required: true },
  area: { type: String, required: true },
  status: { type: String, required: true, enum: ["Pending", "Completed", "In Progress"] }
});

const FDMfSchedule = mongoose.model("FDMfSchedule", FDMfScheduleSchema);

module.exports = FDMfSchedule;
