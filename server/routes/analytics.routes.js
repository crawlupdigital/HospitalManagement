const express = require('express');
const { getInsights } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Analytics Insights
router.get('/insights', authorize('admin'), getInsights);

module.exports = router;
