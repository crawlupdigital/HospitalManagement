const { Appointment, Patient, User, Visitor, Department, sequelize } = require('../models');
const { Op } = require('sequelize');

// ─── Existing ────────────────────────────────────────────────

exports.getAppointments = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.date) where.appointment_date = req.query.date;
    if (req.query.doctor_id) where.doctor_id = req.query.doctor_id;
    if (req.query.type) where.type = req.query.type;
    if (req.query.priority) where.priority = req.query.priority;

    // Search by patient name/phone/uid
    let patientWhere = {};
    if (req.query.search) {
      patientWhere = {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
          { phone: { [Op.like]: `%${req.query.search}%` } },
          { patient_uid: { [Op.like]: `%${req.query.search}%` } }
        ]
      };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, attributes: ['id', 'name', 'patient_uid', 'phone', 'age', 'gender', 'current_stage'], where: Object.keys(patientWhere).length ? patientWhere : undefined, required: !!req.query.search },
        { model: User, attributes: ['id', 'name', 'specialization'] },
        { model: Visitor, attributes: ['id', 'name', 'visitor_type', 'company', 'purpose'], required: false }
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
    const today = new Date().toISOString().split('T')[0];
    const latestAppt = await Appointment.findOne({
      where: { appointment_date: req.body.appointment_date || today },
      order: [['token_no', 'DESC']]
    });

    const nextToken = latestAppt ? latestAppt.token_no + 1 : 1;

    const apptData = {
      ...req.body,
      token_no: nextToken,
      status: 'WAITING',
      created_at: new Date()
    };

    const appointment = await Appointment.create(apptData);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// ─── Smart Quick Book (Register-on-the-fly) ──────────────────

exports.quickBook = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      phone, visitor_type = 'PATIENT', name, age, gender,
      blood_group, city, company, purpose, reference_patient_id,
      doctor_id, appointment_date, appointment_time, time_slot,
      type = 'WALK-IN', priority = 'NORMAL', chief_complaint
    } = req.body;

    let patient = null;
    let isNewPatient = false;

    // 1. For patient-type visitors, lookup or create patient record
    if (['PATIENT', 'FOLLOW_UP', 'EMERGENCY'].includes(visitor_type)) {
      if (phone) {
        patient = await Patient.findOne({ where: { phone }, transaction: t });
      }

      if (!patient) {
        // Generate UID
        const count = await Patient.count({ transaction: t });
        const year = new Date().getFullYear();
        const uid = `MF-${year}-${(count + 1).toString().padStart(4, '0')}`;

        patient = await Patient.create({
          patient_uid: uid,
          name: name || 'Unknown Patient',
          age: age || 0,
          gender: gender || 'OTHER',
          phone: phone || '',
          blood_group: blood_group || null,
          city: city || null,
          current_stage: 'reception',
          registered_by: req.user.id,
          created_at: new Date(),
          updated_at: new Date()
        }, { transaction: t });

        isNewPatient = true;
      }
    }

    // 2. Create visitor record
    const visitor = await Visitor.create({
      visitor_type,
      patient_id: patient?.id || null,
      name: name || patient?.name || 'Unknown',
      phone: phone || '',
      company: company || null,
      purpose: purpose || null,
      reference_patient_id: reference_patient_id || null,
      created_at: new Date()
    }, { transaction: t });

    // 3. Generate token number for the day
    const apptDate = appointment_date || new Date().toISOString().split('T')[0];
    const latestAppt = await Appointment.findOne({
      where: { appointment_date: apptDate },
      order: [['token_no', 'DESC']],
      transaction: t
    });
    const nextToken = latestAppt ? latestAppt.token_no + 1 : 1;

    // 4. Create appointment
    const appointment = await Appointment.create({
      patient_id: patient?.id || null,
      visitor_id: visitor.id,
      visitor_type,
      doctor_id,
      department_id: req.body.department_id || null,
      appointment_date: apptDate,
      appointment_time: appointment_time || new Date().toTimeString().split(' ')[0],
      time_slot: time_slot || null,
      token_no: nextToken,
      type,
      priority,
      chief_complaint: chief_complaint || null,
      status: 'WAITING',
      created_at: new Date()
    }, { transaction: t });

    await t.commit();

    // Fetch doctor info for response
    const doctor = await User.findByPk(doctor_id, { attributes: ['id', 'name', 'specialization'] });

    res.status(201).json({
      success: true,
      data: {
        appointment_id: appointment.id,
        token_no: nextToken,
        patient: patient ? {
          id: patient.id,
          patient_uid: patient.patient_uid,
          name: patient.name,
          is_new: isNewPatient
        } : null,
        visitor: {
          id: visitor.id,
          type: visitor_type,
          name: visitor.name
        },
        doctor: doctor ? { name: doctor.name, specialization: doctor.specialization } : null,
        appointment_date: apptDate,
        time_slot: time_slot || appointment_time
      }
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// ─── Doctor Availability ─────────────────────────────────────

exports.getDoctorsAvailable = async (req, res, next) => {
  try {
    const { date, department_id } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const doctorWhere = { role: 'doctor' };
    if (department_id) doctorWhere.department_id = department_id;

    const doctors = await User.findAll({
      where: doctorWhere,
      attributes: ['id', 'name', 'specialization', 'department_id'],
      include: [{ model: Department, attributes: ['name'] }]
    });

    // Count booked appointments per doctor for the date
    const result = await Promise.all(doctors.map(async (doc) => {
      const bookedCount = await Appointment.count({
        where: {
          doctor_id: doc.id,
          appointment_date: targetDate,
          status: { [Op.ne]: 'CANCELLED' }
        }
      });

      const slotsTotal = 20; // configurable per doctor later
      const slotsAvailable = Math.max(0, slotsTotal - bookedCount);

      // Find next available slot
      const lastAppt = await Appointment.findOne({
        where: { doctor_id: doc.id, appointment_date: targetDate },
        order: [['appointment_time', 'DESC']]
      });

      let nextAvailable = '09:00';
      if (lastAppt && lastAppt.appointment_time) {
        const [h, m] = lastAppt.appointment_time.split(':').map(Number);
        const nextMin = m + 15;
        nextAvailable = `${String(nextMin >= 60 ? h + 1 : h).padStart(2, '0')}:${String(nextMin % 60).padStart(2, '0')}`;
      }

      return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        department: doc.Department?.name || '-',
        slots_available: slotsAvailable,
        slots_total: slotsTotal,
        next_available: nextAvailable
      };
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ─── Existing Status Updates ─────────────────────────────────

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

    if (appointment.patient_id) {
      const patient = await Patient.findByPk(appointment.patient_id);
      if (patient) {
        patient.current_stage = 'triage';
        await patient.save();
      }
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.startConsultation = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    appointment.status = 'IN-PROGRESS';
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
    appointment.status = 'COMPLETED';
    appointment.consultation_end = new Date();
    await appointment.save();
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
