const express = require('express');
const { getLabOrders, collectSample, enterResults } = require('../controllers/lab.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/orders', authorize('lab_tech', 'admin', 'doctor'), getLabOrders);
router.put('/orders/:id/collect', authorize('lab_tech', 'admin'), collectSample);
router.post('/orders/:id/results', authorize('lab_tech', 'admin'), enterResults);

module.exports = router;
