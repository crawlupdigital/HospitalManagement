const express = require('express');
const { 
  getPatients, 
  getPatientById, 
  registerPatient, 
  updatePatient, 
  updatePatientStage,
  recordVitals
} = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getPatients);
router.post('/', authorize('admin', 'receptionist'), registerPatient);
router.get('/:id', getPatientById);
router.put('/:id', authorize('admin', 'receptionist'), updatePatient);

router.put('/:id/stage', updatePatientStage);
router.post('/:id/vitals', authorize('admin', 'doctor', 'nurse', 'icu_manager'), recordVitals);

module.exports = router;
