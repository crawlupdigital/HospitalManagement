const express = require('express');
const { getRadiologyOrders, scheduleScan, uploadReport } = require('../controllers/radiology.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/orders', authorize('radiologist', 'admin', 'doctor'), getRadiologyOrders);
router.put('/orders/:id/schedule', authorize('radiologist', 'admin'), scheduleScan);
router.post('/orders/:id/report', authorize('radiologist', 'admin'), uploadReport);
// Ideally apply multer middleware to /report

module.exports = router;
