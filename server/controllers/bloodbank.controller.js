const { BloodInventory, BloodDonor, BloodRequest, Patient, sequelize } = require('../models');

exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findAll({
      order: [['blood_group', 'ASC'], ['collection_date', 'ASC']]
    });
    
    // Group by blood_group for summary
    const summary = inventory.reduce((acc, current) => {
        const bg = current.blood_group;
        if (!acc[bg]) acc[bg] = 0;
        acc[bg] += current.units_available;
        return acc;
    }, {});

    res.status(200).json({ success: true, data: { inventory, summary } });
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const item = await BloodInventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory record not found' });

    item.units_available = req.body.units_available;
    item.status = req.body.status || item.status;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.registerDonor = async (req, res, next) => {
  try {
    const donor = await BloodDonor.create(req.body);
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    next(error);
  }
};

exports.getDonors = async (req, res, next) => {
  try {
    const donors = await BloodDonor.findAll({ order: [['created_at', 'DESC']] });
    res.status(200).json({ success: true, data: donors });
  } catch (error) {
    next(error);
  }
};

exports.createRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.create({
      ...req.body,
      requested_by: req.user.id,
      status: 'pending'
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

exports.fulfillRequest = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const request = await BloodRequest.findByPk(req.params.id, { transaction: t });
    if (!request || request.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // Find available inventory
    const inventory = await BloodInventory.findAll({
      where: { blood_group: request.blood_group, status: 'available' },
      order: [['expiry_date', 'ASC']], // Use oldest first
      transaction: t
    });

    let unitsNeeded = request.units_requested;
    let unitsFulfilled = 0;

    for (let inv of inventory) {
      if (unitsNeeded <= 0) break;
      
      const take = Math.min(inv.units_available, unitsNeeded);
      inv.units_available -= take;
      if (inv.units_available === 0) inv.status = 'used';
      
      await inv.save({ transaction: t });
      
      unitsNeeded -= take;
      unitsFulfilled += take;
    }

    if (unitsFulfilled < request.units_requested) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient blood units available in inventory' });
    }

    request.status = 'fulfilled';
    request.fulfilled_by = req.user.id;
    request.fulfilled_at = new Date();
    await request.save({ transaction: t });

    await t.commit();
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
