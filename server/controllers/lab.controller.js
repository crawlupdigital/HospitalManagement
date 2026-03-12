const { LabOrder, LabResult, Patient } = require('../models');

exports.getLabOrders = async (req, res, next) => {
  try {
    const orders = await LabOrder.findAll({
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

exports.collectSample = async (req, res, next) => {
  try {
    const order = await LabOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.sample_collected = true;
    order.sample_collected_by = req.user.id;
    order.sample_collected_at = new Date();
    order.status = 'sample_collected';
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.enterResults = async (req, res, next) => {
  try {
    const { results } = req.body; // Array of { parameter, value, range, unit, is_abnormal }
    const orderId = req.params.id;

    const order = await LabOrder.findByPk(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Assuming we do this in transaction in prod
    const savedResults = [];
    for (const resData of results) {
      const lr = await LabResult.create({
        lab_order_id: orderId,
        parameter_name: resData.parameter_name,
        result_value: resData.result_value,
        normal_range: resData.normal_range,
        unit: resData.unit,
        is_abnormal: resData.is_abnormal || false,
        entered_by: req.user.id,
      });
      savedResults.push(lr);
    }

    order.status = 'completed';
    await order.save();

    // Mark parent prescription item as completed
    const { PrescriptionItem } = require('../models');
    const pItem = await PrescriptionItem.findByPk(order.prescription_item_id);
    if (pItem) {
      pItem.status = 'completed';
      pItem.completed_at = new Date();
      await pItem.save();
    }

    res.status(201).json({ success: true, data: savedResults });
  } catch (error) {
    next(error);
  }
};
