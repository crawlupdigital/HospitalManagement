const { PrescriptionItem, Patient, NursingTask, Vitals } = require('../models');

// Note: A real implementation would automatically create `NursingTask` entries 
// inside `prescription.routing.service.js` or let nurses pick them up from PrescriptionItems directly.
// We'll use PrescriptionItem directly as the "queue" for simplicity, representing the tasks.

exports.getNursingQueue = async (req, res, next) => {
  try {
    const queue = await PrescriptionItem.findAll({
      where: {
        routed_to: 'nursing',
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

exports.completeTask = async (req, res, next) => {
  try {
    const pItem = await PrescriptionItem.findByPk(req.params.id);
    if (!pItem) return res.status(404).json({ success: false, message: 'Task not found' });

    pItem.status = 'completed';
    pItem.completed_by = req.user.id;
    pItem.completed_at = new Date();
    // In a full implementation, we might save notes to a related nursing_tasks table.
    await pItem.save();

    res.status(200).json({ success: true, data: pItem });
  } catch (error) {
    next(error);
  }
};
