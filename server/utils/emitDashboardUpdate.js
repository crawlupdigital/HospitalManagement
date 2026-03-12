const { getIo } = require('../config/socket');
const { Patient, Appointment, Invoice, Bed } = require('../models');

const emitDashboardUpdate = async () => {
  try {
    const io = getIo();
    const today = new Date().toISOString().split('T')[0];

    const [total_patients, today_appointments, total_revenue, occupiedBeds, totalBeds] = await Promise.all([
      Patient.count(),
      Appointment.count({ where: { appointment_date: today } }),
      Invoice.sum('grand_total', { where: { status: 'PAID' } }).then(v => v || 0),
      Bed.count({ where: { status: 'occupied' } }),
      Bed.count()
    ]);

    io.emit('stats:update', {
      total_patients,
      today_appointments,
      total_revenue,
      bed_occupancy: {
        occupied: occupiedBeds,
        total: totalBeds,
        rate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0
      }
    });
  } catch (err) {
    console.error('emitDashboardUpdate error:', err.message);
  }
};

module.exports = { emitDashboardUpdate };
