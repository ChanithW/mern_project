import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
  },
  totalAmount: { 
    type: Number, 
    required: true, 
  },
});

const Store = mongoose.model('Store', storeSchema);

export default Store;