const { Invoice, InvoiceItem, Payment, Patient, Appointment, Dispensing, LabOrder, RadiologyOrder, sequelize } = require('../models');

exports.getInvoices = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.patient_id) where.patient_id = req.query.patient_id;

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Patient, attributes: ['name', 'patient_uid', 'phone'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

const generateInvoiceNumber = async () => {
    const count = await Invoice.count();
    const year = new Date().getFullYear();
    return `INV-${year}-${(count + 1).toString().padStart(4, '0')}`;
};

// Auto-generate invoice aggregating all charges
exports.generateInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { patient_id, appointment_id } = req.body;

    // 1. Consultation Fee
    let consultation_fee = 500; // Fixed for now, could fetch from doctor/dept
    
    // 2. Medicine Total
    const dispensings = await Dispensing.findAll({ 
        where: { patient_id }, 
        transaction: t 
    });
    const medicine_total = dispensings.reduce((sum, d) => sum + parseFloat(d.total_price), 0);

    // 3. Lab Total
    const labOrders = await LabOrder.findAll({
        where: { patient_id, status: 'completed' },
        transaction: t
    });
    const lab_total = labOrders.reduce((sum, l) => sum + parseFloat(l.unit_price), 0);

    // 4. Radiology Total
    const radOrders = await RadiologyOrder.findAll({
        where: { patient_id, status: 'completed' },
        transaction: t
    });
    const radiology_total = radOrders.reduce((sum, r) => sum + parseFloat(r.unit_price), 0);

    // Calculations
    const subtotal = consultation_fee + medicine_total + lab_total + radiology_total;
    const tax = subtotal * 0.05; // 5% GST
    const grand_total = subtotal + tax;

    const invNo = await generateInvoiceNumber();

    const invoice = await Invoice.create({
      invoice_no: invNo,
      patient_id,
      appointment_id,
      consultation_fee,
      medicine_total,
      lab_total,
      radiology_total,
      subtotal,
      tax,
      grand_total,
      patient_payable: grand_total, // assumes no insurance for now
      status: 'pending',
      generated_by: req.user.id
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Patient, attributes: ['name', 'patient_uid', 'phone', 'address'] },
        // { model: InvoiceItem } // If we break down items further
      ]
    });

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

exports.recordPayment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, payment_method, transaction_ref } = req.body;
    const invoiceId = req.params.id;

    const invoice = await Invoice.findByPk(invoiceId, { transaction: t });
    if (!invoice) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const payment = await Payment.create({
      invoice_id: invoiceId,
      amount,
      payment_method,
      transaction_ref,
      received_by: req.user.id
    }, { transaction: t });

    // Update Invoice Status
    const totalPaid = await Payment.sum('amount', { where: { invoice_id: invoiceId }, transaction: t }) || 0;
    
    if (totalPaid >= invoice.grand_total) {
        invoice.status = 'paid';
    } else {
        invoice.status = 'partial';
    }
    await invoice.save({ transaction: t });

    // Mark patient as discharged potentially if fully paid
    if (invoice.status === 'paid') {
        const patient = await Patient.findByPk(invoice.patient_id, { transaction: t });
        if(patient && patient.current_stage === 'billing') {
            patient.current_stage = 'discharged';
            await patient.save({ transaction: t });
        }
    }

    await t.commit();
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
