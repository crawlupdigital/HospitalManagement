const express = require('express');
const { getClaims, submitClaim, reviewClaim } = require('../controllers/insurance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/claims', authorize('insurance', 'admin', 'billing'), getClaims);
router.post('/claims', authorize('insurance', 'billing', 'admin'), submitClaim);
router.put('/claims/:id/review', authorize('insurance', 'admin'), reviewClaim);

module.exports = router;
