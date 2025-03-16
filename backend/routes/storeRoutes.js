import express from 'express';
import { addStoreRecord } from './controller/storeContoller.js';

const router = express.Router();

// Route to add a new store record
router.post('/store', addStoreRecord);

export default router;