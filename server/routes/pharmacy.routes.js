const express = require('express');
const { getPharmacyQueue, getMedicines, dispenseMedicine } = require('../controllers/pharmacy.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Pharmacy Queue
router.get('/queue', authorize('pharmacist', 'admin'), getPharmacyQueue);

// Inventory
router.get('/medicines', getMedicines);

// Operations
router.post('/dispense', authorize('pharmacist', 'admin'), dispenseMedicine);

module.exports = router;
