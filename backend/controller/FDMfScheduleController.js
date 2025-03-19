const FDMfSchedule = require("../model/FDMfScheduleModel");

// Get all schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await FDMfSchedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
}; 

// Get a single schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await FDMfSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = new FDMfSchedule(req.body);
    await newSchedule.save();
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating schedule" });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await FDMfSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await FDMfSchedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
