const express = require('express');
const { 
  getAppointments, 
  bookAppointment, 
  quickBook,
  getDoctorsAvailable,
  updateAppointment, 
  checkIn, 
  startConsultation, 
  endConsultation 
} = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const socketEmitter = require('../middleware/socketEmitter.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', getAppointments);
router.post('/', authorize('admin', 'receptionist'), socketEmitter('appointment:new'), bookAppointment);
router.post('/quick-book', authorize('admin', 'receptionist'), socketEmitter('appointment:new'), quickBook);

router.get('/doctors/available', getDoctorsAvailable);

router.put('/:id', updateAppointment);
router.put('/:id/checkin', socketEmitter('appointment:status-change'), checkIn);
router.put('/:id/start', socketEmitter('appointment:status-change'), startConsultation);
router.put('/:id/end', socketEmitter('appointment:status-change'), endConsultation);

module.exports = router;
