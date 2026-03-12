const express = require('express');
const { getFleet, updateAmbulanceStatus, dispatchAmbulance, getTrips, completeTrip } = require('../controllers/ambulance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Fleet
router.get('/fleet', getFleet);
router.put('/:id/status', authorize('ambulance', 'admin'), updateAmbulanceStatus);

// Trip Dispatch logic
router.post('/dispatch', authorize('ambulance', 'admin', 'receptionist'), dispatchAmbulance);
router.get('/trips', authorize('ambulance', 'admin'), getTrips);
router.put('/trips/:id/complete', authorize('ambulance', 'admin'), completeTrip);

module.exports = router;
