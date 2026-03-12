const express = require('express');
const { getInventory, updateInventory, registerDonor, getDonors, createRequest, fulfillRequest } = require('../controllers/bloodbank.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Inventory
router.get('/inventory', getInventory);
router.put('/inventory/:id', authorize('blood_bank_tech', 'admin'), updateInventory);

// Donors
router.post('/donors', authorize('blood_bank_tech', 'admin', 'receptionist'), registerDonor);
router.get('/donors', authorize('blood_bank_tech', 'admin'), getDonors);

// Requests
router.post('/requests', authorize('doctor', 'admin'), createRequest);
router.put('/requests/:id/fulfill', authorize('blood_bank_tech', 'admin'), fulfillRequest);

module.exports = router;
