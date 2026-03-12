const { RadiologyOrder, Patient } = require('../models');

exports.getRadiologyOrders = async (req, res, next) => {
  try {
    const orders = await RadiologyOrder.findAll({
      where: req.query.status ? { status: req.query.status } : {},
      include: [
        { model: Patient, attributes: ['name', 'patient_uid'] }
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.scheduleScan = async (req, res, next) => {
  try {
    const order = await RadiologyOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'scheduled';
    // Ideally we save the scheduled time as well
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.uploadReport = async (req, res, next) => {
  try {
    const { report_text } = req.body;
    // req.file would have the DICOM/PDF if configured with multer
    const report_file_url = req.file ? `/uploads/radiology/${req.file.filename}` : null;

    const order = await RadiologyOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.report_text = report_text;
    order.report_file_url = report_file_url;
    order.status = 'completed';
    order.reported_by = req.user.id;
    order.completed_at = new Date();
    await order.save();

    // Mark parent prescription item as completed
    const { PrescriptionItem } = require('../models');
    const pItem = await PrescriptionItem.findByPk(order.prescription_item_id);
    if (pItem) {
      pItem.status = 'completed';
      pItem.completed_by = req.user.id;
      pItem.completed_at = new Date();
      await pItem.save();
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
