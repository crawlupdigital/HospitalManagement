const { InsuranceClaim, Patient, Invoice, sequelize } = require('../models');

exports.getClaims = async (req, res, next) => {
  try {
    const claims = await InsuranceClaim.findAll({
      where: req.query.status ? { status: req.query.status } : {},
      include: [
        { model: Patient, attributes: ['name', 'patient_uid'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    next(error);
  }
};

exports.submitClaim = async (req, res, next) => {
  try {
    const claim = await InsuranceClaim.create({
      ...req.body,
      status: 'submitted'
    });

    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

exports.reviewClaim = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { status, approved_amount, remarks } = req.body;
    const claim = await InsuranceClaim.findByPk(req.params.id, { transaction: t });
    
    if (!claim) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    claim.status = status;
    claim.approved_amount = approved_amount;
    claim.remarks = remarks;
    if (status === 'settled' || status === 'rejected') {
        claim.resolved_at = new Date();
    }
    
    await claim.save({ transaction: t });

    // If approved/settled, apply discount/payment to invoice
    if (status === 'approved' || status === 'settled') {
        if(claim.invoice_id) {
            const invoice = await Invoice.findByPk(claim.invoice_id, { transaction: t });
            if (invoice) {
                invoice.insurance_amount = approved_amount;
                invoice.patient_payable = invoice.grand_total - approved_amount;
                await invoice.save({ transaction: t });
            }
        }
    }

    await t.commit();
    res.status(200).json({ success: true, data: claim });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
