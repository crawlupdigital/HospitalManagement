const { Appointment, Patient, User } = require('../models');

exports.getAppointments = async (req, res, next) => {
  try {
    // Basic filters
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.date) where.appointment_date = req.query.date;
    if (req.query.doctor_id) where.doctor_id = req.query.doctor_id;

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, attributes: ['id', 'name', 'patient_uid', 'phone', 'current_stage'] },
        { model: User, attributes: ['id', 'name', 'specialization'] } // Doctor
      ],
      order: [['token_no', 'ASC']]
    });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

exports.bookAppointment = async (req, res, next) => {
  try {
    // Generate Token Number automatically based on day/doctor logic
    const today = new Date().toISOString().split('T')[0];
    const latestAppt = await Appointment.findOne({
      where: { appointment_date: req.body.appointment_date || today },
      order: [['token_no', 'DESC']]
    });

    const nextToken = latestAppt ? latestAppt.token_no + 1 : 1;

    const apptData = {
      ...req.body,
      token_no: nextToken,
      status: 'waiting',
      created_at: new Date()
    };

    const appointment = await Appointment.create(apptData);

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    await appointment.update(req.body);
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.checked_in_at = new Date();
    await appointment.save();

    // Update patient stage
    const patient = await Patient.findByPk(appointment.patient_id);
    if (patient) {
      patient.current_stage = 'triage';
      await patient.save();
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.startConsultation = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    appointment.status = 'in-progress';
    appointment.consultation_start = new Date();
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.endConsultation = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    appointment.status = 'completed';
    appointment.consultation_end = new Date();
    await appointment.save();
    
    // Stage updates will likely be handled by the Prescription generation logic
    
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
