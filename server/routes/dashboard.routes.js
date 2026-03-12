const express = require('express');
const { getStats, getPatientFlow, getDepartmentLoad, getRevenueChart, getRecentActivity } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/patient-flow', getPatientFlow);
router.get('/department-load', getDepartmentLoad);
router.get('/revenue-chart', getRevenueChart);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
