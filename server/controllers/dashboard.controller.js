const { User, Patient, Appointment, Invoice, Bed, Department, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [total_patients, today_appointments, total_revenue, occupiedBeds, totalBeds] = await Promise.all([
      Patient.count(),
      Appointment.count({ where: { appointment_date: today } }),
      Invoice.sum('grand_total', { where: { status: 'PAID' } }).then(v => v || 0),
      Bed.count({ where: { status: 'occupied' } }),
      Bed.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        total_patients,
        today_appointments,
        total_revenue,
        bed_occupancy: {
          occupied: occupiedBeds,
          total: totalBeds,
          rate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientFlow = async (req, res, next) => {
  try {
    const distribution = await Patient.count({
      attributes: ['current_stage'],
      group: 'current_stage'
    });
    const formatted = distribution.map(d => ({
      stage: d.current_stage,
      count: d.count
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

exports.getDepartmentLoad = async (req, res, next) => {
  try {
    const { PrescriptionItem } = require('../models');
    const load = await PrescriptionItem.count({
      where: { status: 'pending' },
      attributes: ['routed_to'],
      group: 'routed_to'
    });
    const formatted = load.map(d => ({
      department: d.routed_to,
      pending_tasks: d.count
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// ─── NEW: Revenue Chart (last N days) ────────────────────────

exports.getRevenueChart = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await Invoice.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('grand_total')), 'revenue']
      ],
      where: {
        status: 'PAID',
        created_at: { [Op.gte]: startDate }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Fill gaps for days with no revenue
    const chart = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = results.find(r => r.date === dateStr);
      chart.push({
        date: dateStr,
        revenue: entry ? parseFloat(entry.revenue) : 0
      });
    }

    res.status(200).json({ success: true, data: chart });
  } catch (error) {
    next(error);
  }
};

// ─── NEW: Recent Activity Feed ───────────────────────────────

exports.getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent appointments
    const recentAppts = await Appointment.findAll({
      include: [{ model: Patient, attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    // Get recent patients
    const recentPatients = await Patient.findAll({
      order: [['created_at', 'DESC']],
      limit: 5
    });

    // Merge and sort by time
    const activities = [];

    recentAppts.forEach(a => {
      activities.push({
        type: 'appointment',
        action: a.status === 'COMPLETED' ? 'completed' : a.status === 'IN-PROGRESS' ? 'started' : 'booked',
        patient: a.Patient?.name || 'Unknown',
        detail: `Token #${a.token_no}`,
        time: a.created_at
      });
    });

    recentPatients.forEach(p => {
      activities.push({
        type: 'patient',
        action: 'registered',
        patient: p.name,
        detail: p.patient_uid,
        time: p.created_at
      });
    });

    // Sort by time descending and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Format relative time
    const now = new Date();
    const formatted = activities.slice(0, limit).map(a => {
      const diff = Math.floor((now - new Date(a.time)) / 60000);
      let timeStr;
      if (diff < 1) timeStr = 'just now';
      else if (diff < 60) timeStr = `${diff}m ago`;
      else if (diff < 1440) timeStr = `${Math.floor(diff / 60)}h ago`;
      else timeStr = `${Math.floor(diff / 1440)}d ago`;

      return { ...a, time: timeStr };
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};
