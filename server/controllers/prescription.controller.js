const { Prescription, PrescriptionItem, Patient, sequelize } = require('../models');
const { routePrescriptionItems } = require('../services/prescription.routing.service');

exports.getPrescriptions = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.patient_id) where.patient_id = req.query.patient_id;
    if (req.query.doctor_id) where.doctor_id = req.query.doctor_id;

    const prescriptions = await Prescription.findAll({
      where,
      include: [
        { model: PrescriptionItem },
        { model: Patient, attributes: ['name', 'patient_uid'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id, {
      include: [{ model: PrescriptionItem }]
    });

    if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });

    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

exports.createPrescription = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { patient_id, appointment_id, diagnosis, clinical_notes, items } = req.body;

    // 1. Create Core Prescription
    const prescription = await Prescription.create({
      patient_id,
      doctor_id: req.user.id,
      appointment_id,
      diagnosis,
      clinical_notes,
      status: 'active'
    }, { transaction: t });

    // 2. Route Items & Generate Child Orders via Service
    if (items && items.length > 0) {
      await routePrescriptionItems(prescription.id, items, patient_id, req.user.id, t);
    }

    // 3. Commit Transaction
    await t.commit();

    // 4. Fetch the fully populated prescription to return
    const fullPrescription = await Prescription.findByPk(prescription.id, {
        include: [{ model: PrescriptionItem }]
    });

    res.status(201).json({ success: true, data: fullPrescription });

  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.updatePrescriptionItemStatus = async (req, res, next) => {
  try {
    const item = await PrescriptionItem.findByPk(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.status = req.body.status || 'completed';
    item.completed_by = req.user.id;
    item.completed_at = new Date();
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};
