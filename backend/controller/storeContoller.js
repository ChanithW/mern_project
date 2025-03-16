import Store from '../model/storeModel.js';

// Insert a new store record
export const addStoreRecord = async (req, res) => {
  try {
    const { date, totalAmount } = req.body;

    if (!date || !totalAmount) {
      return res.status(400).json({ message: 'Date and total amount are required' });
    }

    const newStoreRecord = new Store({ date, totalAmount });
    await newStoreRecord.save();

    res.status(201).json({ message: 'Record added successfully', data: newStoreRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};