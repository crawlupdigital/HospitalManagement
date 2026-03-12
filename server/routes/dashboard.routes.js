const express = require('express');
const { getStats, getPatientFlow, getDepartmentLoad } = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/stats', authorize('admin', 'receptionist'), getStats);
router.get('/patient-flow', authorize('admin', 'receptionist', 'doctor'), getPatientFlow);
router.get('/department-load', authorize('admin'), getDepartmentLoad);

module.exports = router;
