const { User, Patient, Appointment, Invoice, Bed, Department } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const patientCount = await Patient.count();
    const todayAppointments = await Appointment.count({
      where: {
        appointment_date: today.toISOString().split('T')[0]
      }
    });
    const totalRevenue = await Invoice.sum('grand_total', { where: { status: 'paid' } }) || 0;
    const occupiedBeds = await Bed.count({ where: { status: 'occupied' } });
    const totalBeds = await Bed.count();

    res.status(200).json({
      success: true,
      data: {
        total_patients: patientCount,
        today_appointments: todayAppointments,
        total_revenue: totalRevenue,
        bed_occupancy: {
            occupied: occupiedBeds,
            total: totalBeds,
            rate: totalBeds > 0 ? ((occupiedBeds/totalBeds)*100).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientFlow = async (req, res, next) => {
    try {
        // Count patients by current stage
        const distribution = await Patient.count({
            attributes: ['current_stage'],
            group: 'current_stage'
        });
        
        // Format for frontend
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
        // Quick pending task count per department 
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
