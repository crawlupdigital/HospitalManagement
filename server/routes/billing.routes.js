const express = require('express');
const { getInvoices, generateInvoice, getInvoiceById, recordPayment } = require('../controllers/billing.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/invoices', authorize('billing', 'admin'), getInvoices);
router.post('/invoices/generate', authorize('billing', 'admin'), generateInvoice);
router.get('/invoices/:id', authorize('billing', 'admin', 'patient'), getInvoiceById);
router.post('/invoices/:id/pay', authorize('billing', 'admin'), recordPayment);

module.exports = router;
