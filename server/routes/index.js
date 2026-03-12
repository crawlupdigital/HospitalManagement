const express = require('express');

const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const appointmentRoutes = require('./appointment.routes');
const prescriptionRoutes = require('./prescription.routes');
const pharmacyRoutes = require('./pharmacy.routes');
const nursingRoutes = require('./nursing.routes');
const labRoutes = require('./lab.routes');
const radiologyRoutes = require('./radiology.routes');
const billingRoutes = require('./billing.routes');
const bloodbankRoutes = require('./bloodbank.routes');
const ambulanceRoutes = require('./ambulance.routes');
const icuRoutes = require('./icu.routes');
const insuranceRoutes = require('./insurance.routes');
const dashboardRoutes = require('./dashboard.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MediFlow HMS API is running' });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/nursing', nursingRoutes);
router.use('/lab', labRoutes);
router.use('/radiology', radiologyRoutes);
router.use('/billing', billingRoutes);
router.use('/bloodbank', bloodbankRoutes);
router.use('/ambulance', ambulanceRoutes);
router.use('/icu', icuRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
