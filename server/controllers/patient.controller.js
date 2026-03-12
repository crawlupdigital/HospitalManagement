const { Patient, Vital, Appointment, PatientJourney } = require('../models');

// Utilities
const generatePatientId = async () => {
  const count = await Patient.count();
  const year = new Date().getFullYear();
  return `MF-${year}-${(count + 1).toString().padStart(4, '0')}`;
};

exports.getPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, stage, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (stage) where.current_stage = stage;
    // Add fuzzy search later for name/phone if needed

    const patients = await Patient.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        { model: Vital },
        { model: Appointment }
      ]
    });
    
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.registerPatient = async (req, res, next) => {
  try {
    const uid = await generatePatientId();
    const patientData = {
      ...req.body,
      patient_uid: uid,
      registered_by: req.user.id,
      current_stage: 'reception',
      created_at: new Date(),
      updated_at: new Date()
    };

    const patient = await Patient.create(patientData);

    // Initial journey log
    // await patient_journey.create({
    //   patient_id: patient.id,
    //   stage: 'reception',
    //   handled_by: req.user.id,
    //   action: 'Patient registered at reception'
    // });

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    await patient.update({
        ...req.body,
        updated_at: new Date()
    });
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.updatePatientStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    patient.current_stage = stage;
    await patient.save();

    // Log journey
    // await patient_journey.create({
    //   patient_id: patient.id,
    //   stage,
    //   handled_by: req.user.id,
    //   action: `Patient moved to ${stage}`
    // });

    // Optional: Emit socket event
    const { getIo } = require('../config/socket');
    getIo().to(`patient:${patient.id}`).emit('stage_update', { stage });

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

exports.recordVitals = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      patient_id: req.params.id,
      recorded_by: req.user.id,
      recorded_at: new Date()
    };
    
    const vitals = await Vital.create(data);
    
    // Auto update stage to consultation if they were in triage
    const patient = await Patient.findByPk(req.params.id);
    if(patient && patient.current_stage === 'triage') {
        patient.current_stage = 'consultation';
        await patient.save();
    }
    
    res.status(201).json({ success: true, data: vitals });
  } catch (error) {
    next(error);
  }
};
