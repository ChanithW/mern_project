const ODMdriveModel = require("../model/ODMdriveModel");

// Get all deliveries
const getdriver = async (req, res) => {
  try {
    const drive = await ODMdriveModel.find();
    if (!drive || drive.length === 0) {
      return res.status(404).json({ message: "No delivery found." });
    }
    return res.status(200).json({ drive });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

// Add a new delivery (auto-generate DeliveryID)
const adddrive = async (req, res) => {
  const {
    TripDate,
    DepartureTime,
    VehicleNumber,
    StockID,
    FactoryLocation,
    EstimatedArrivalTime,
    ActualArrivalTime,
    Deliverystatus,
    DeliveryNotes,
    TraveledDistance,
    FuelConsumption,
  } = req.body;

  try {
    // Find the last inserted document to generate the next DeliveryID
    const lastDrive = await ODMdriveModel.findOne().sort({ DeliveryID: -1 });

    let newDeliveryID = "D001"; // Default to D001 if no records exist
    if (lastDrive && lastDrive.DeliveryID) {
      const lastNumber = parseInt(lastDrive.DeliveryID.substring(1)); // Extract number from "D001"
      const nextNumber = lastNumber + 1;
      newDeliveryID = "D" + String(nextNumber).padStart(3, "0"); // Generate next DeliveryID (e.g., D002)
    }

    const newDrive = new ODMdriveModel({
      DeliveryID: newDeliveryID,
      TripDate,
      DepartureTime,
      VehicleNumber,
      StockID,
      FactoryLocation,
      EstimatedArrivalTime,
      ActualArrivalTime,
      Deliverystatus,
      DeliveryNotes,
      TraveledDistance,
      FuelConsumption,
    });

    await newDrive.save();
    return res.status(201).json({ drive: newDrive });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add delivery", error: err });
  }
};

// Get a delivery by ID
const getById = async (req, res) => {
  const id = req.params.id;

  try {
    const drive = await ODMdriveModel.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Details not found" });
    }
    return res.status(200).json({ drive });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching delivery", error: err });
  }
};

// Update delivery by ID
const updatedrive = async (req, res) => {
  const id = req.params.id;
  const {
    TripDate,
    DepartureTime,
    VehicleNumber,
    StockID,
    FactoryLocation,
    EstimatedArrivalTime,
    ActualArrivalTime,
    Deliverystatus,
    DeliveryNotes,
    TraveledDistance,
    FuelConsumption,
  } = req.body;

  try {
    let drive = await ODMdriveModel.findByIdAndUpdate(
      id,
      {
        TripDate,
        DepartureTime,
        VehicleNumber,
        StockID,
        FactoryLocation,
        EstimatedArrivalTime,
        ActualArrivalTime,
        Deliverystatus,
        DeliveryNotes,
        TraveledDistance,
        FuelConsumption,
      },
      { new: true } // Return the updated document
    );

    if (!drive) {
      return res.status(404).json({ message: "Unable to update" });
    }
    return res.status(200).json({ drive });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating delivery", error: err });
  }
};

// Delete delivery by ID
const deletedrive = async (req, res) => {
  const id = req.params.id;

  try {
    const drive = await ODMdriveModel.findByIdAndDelete(id);
    if (!drive) {
      return res.status(404).json({ message: "Unable to delete" });
    }
    return res.status(200).json({ message: "Delivery deleted successfully", drive });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting delivery", error: err });
  }
};

exports.getdriver = getdriver;
exports.adddrive = adddrive;
exports.getById = getById;
exports.updatedrive = updatedrive;
exports.deletedrive = deletedrive;
