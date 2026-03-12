const express = require('express');
const { 
  getPrescriptions, 
  getPrescriptionById, 
  createPrescription, 
  updatePrescriptionItemStatus 
} = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getPrescriptions);
router.post('/', authorize('doctor', 'admin'), createPrescription);
router.get('/:id', getPrescriptionById);

// Department staff marks item as completed from their queue
router.put('/items/:itemId/complete', authorize('pharmacist', 'nurse', 'lab_tech', 'radiologist', 'admin'), updatePrescriptionItemStatus);

module.exports = router;
