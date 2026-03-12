const { PrescriptionItem, Dispensing, Medicine, Patient, sequelize } = require('../models');

exports.getPharmacyQueue = async (req, res, next) => {
  try {
    const queue = await PrescriptionItem.findAll({
      where: {
        routed_to: 'pharmacy',
        status: 'pending' // or in-progress
      },
      include: [
        { model: require('../models/Prescription'), include: [{ model: Patient, attributes: ['name', 'patient_uid'] }] }
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    next(error);
  }
};

exports.getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.findAll({
      where: { is_active: true }
    });
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};

exports.dispenseMedicine = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { prescription_item_id, medicine_id, quantity, patient_id } = req.body;

    const medicine = await Medicine.findByPk(medicine_id, { transaction: t });
    if (!medicine || medicine.stock_quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient stock or medicine not found' });
    }

    const total_price = medicine.unit_price * quantity;

    // 1. Create Dispensing Record
    const dispensing = await Dispensing.create({
      prescription_item_id,
      medicine_id,
      patient_id,
      dispensed_by: req.user.id,
      quantity_dispensed: quantity,
      unit_price: medicine.unit_price,
      total_price,
      status: 'dispensed'
    }, { transaction: t });

    // 2. Reduce Stock
    medicine.stock_quantity -= quantity;
    await medicine.save({ transaction: t });

    // 3. Mark Prescription Item as Completed
    const pItem = await PrescriptionItem.findByPk(prescription_item_id, { transaction: t });
    if (pItem) {
      pItem.status = 'completed';
      pItem.completed_by = req.user.id;
      pItem.completed_at = new Date();
      await pItem.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, data: dispensing });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
