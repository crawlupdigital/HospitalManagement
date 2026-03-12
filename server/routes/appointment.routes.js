const express = require('express');
const { 
  getAppointments, 
  bookAppointment, 
  updateAppointment,
  checkIn,
  startConsultation,
  endConsultation
} = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getAppointments);
router.post('/', authorize('admin', 'receptionist'), bookAppointment);
router.put('/:id', authorize('admin', 'receptionist', 'doctor'), updateAppointment);

router.put('/:id/checkin', authorize('admin', 'receptionist'), checkIn);
router.put('/:id/start', authorize('admin', 'doctor'), startConsultation);
router.put('/:id/complete', authorize('admin', 'doctor'), endConsultation);

module.exports = router;
