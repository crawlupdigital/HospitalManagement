const express = require('express');
const { getWards, getBeds, allocateBed, releaseBed, markMaintenance } = require('../controllers/icu.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/wards', getWards);
router.get('/beds', getBeds);

// Bed Allocation logic
router.post('/beds/allocate', authorize('icu_manager', 'admin', 'doctor'), allocateBed);
router.put('/beds/:id/release', authorize('icu_manager', 'admin'), releaseBed);
router.put('/beds/:id/maintenance', authorize('icu_manager', 'admin'), markMaintenance);

module.exports = router;
