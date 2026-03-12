const { Ward, Bed, BedAllocation, Patient, sequelize } = require('../models');

exports.getWards = async (req, res, next) => {
  try {
    const wards = await Ward.findAll();
    res.status(200).json({ success: true, data: wards });
  } catch (error) {
    next(error);
  }
};

exports.getBeds = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.ward_id) where.ward_id = req.query.ward_id;
    if (req.query.status) where.status = req.query.status;

    const beds = await Bed.findAll({
      where,
      include: [
        { model: Ward, attributes: ['name', 'type', 'charge_per_day'] },
        // Could also include active allocation / Patient info here
      ]
    });
    res.status(200).json({ success: true, data: beds });
  } catch (error) {
    next(error);
  }
};

exports.allocateBed = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { bed_id, patient_id } = req.body;

    const bed = await Bed.findByPk(bed_id, { transaction: t });
    if (!bed || bed.status !== 'available') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Bed not available' });
    }

    const patient = await Patient.findByPk(patient_id, { transaction: t });
    if (!patient) {
      await t.rollback();
       return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Allocate
    const allocation = await BedAllocation.create({
      bed_id,
      patient_id,
      allocated_by: req.user.id,
      admission_date: new Date()
    }, { transaction: t });

    // Update Bed Status
    bed.status = 'occupied';
    await bed.save({ transaction: t });

    // Update Patient Stage
    patient.current_stage = 'admitted';
    patient.is_admitted = true;
    await patient.save({ transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: allocation });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.releaseBed = async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
     const bed = await Bed.findByPk(req.params.id, { transaction: t });
     if (!bed || bed.status !== 'occupied') {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Bed is not occupied' });
     }

     const allocation = await BedAllocation.findOne({
         where: { bed_id: bed.id, discharge_date: null },
         transaction: t
     });

     if (allocation) {
         allocation.discharge_date = new Date();
         await allocation.save({ transaction: t });
     }

     bed.status = 'available';
     await bed.save({ transaction: t });

     await t.commit();
     res.status(200).json({ success: true, message: 'Bed released successfully' });
   } catch(error) {
       await t.rollback();
       next(error);
   }
};

exports.markMaintenance = async (req, res, next) => {
   try {
     const bed = await Bed.findByPk(req.params.id);
     if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' });

     bed.status = 'maintenance';
     await bed.save();
     
     res.status(200).json({ success: true, data: bed });
   } catch(error) {
       next(error);
   }
};
