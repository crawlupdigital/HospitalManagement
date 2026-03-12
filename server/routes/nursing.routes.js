const express = require('express');
const { getNursingQueue, completeTask } = require('../controllers/nursing.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Nursing Queue (Injections, Procedures, Vitals orders)
router.get('/queue', authorize('nurse', 'admin'), getNursingQueue);

// Task Operations
router.put('/tasks/:id/complete', authorize('nurse', 'admin'), completeTask);

module.exports = router;
