const { Prescription, PrescriptionItem, LabOrder, RadiologyOrder, Patient } = require('../models');
const { getIo } = require('../config/socket');

/**
 * Service to automatically route prescription items to their respective departments
 * and notify them via Socket.io
 */
const routePrescriptionItems = async (prescriptionId, items, patientId, doctorId, transaction) => {
  const createdItems = [];

  for (const item of items) {
    let routed_to;

    // Determine target department based on item type
    switch (item.type) {
      case 'medicine':
        routed_to = 'pharmacy';
        break;
      case 'injection':
      case 'procedure':
        routed_to = 'nursing';
        break;
      case 'lab_test':
        routed_to = 'lab';
        break;
      case 'xray':
      case 'imaging':
        routed_to = 'radiology';
        break;
      default:
        routed_to = 'nursing'; // fallback
    }

    // 1. Create the Prescription Item
    const pItem = await PrescriptionItem.create({
      prescription_id: prescriptionId,
      type: item.type,
      item_name: item.item_name,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      route: item.route,
      instructions: item.instructions,
      quantity: item.quantity || 1,
      is_urgent: item.is_urgent || false,
      routed_to,
      status: 'pending'
    }, { transaction });

    createdItems.push(pItem);

    // 2. Create Corresponding Department Orders (Lab/Radiology)
    if (routed_to === 'lab') {
      await LabOrder.create({
        prescription_item_id: pItem.id,
        patient_id: patientId,
        ordered_by: doctorId,
        test_name: item.item_name,
        priority: item.is_urgent ? 'urgent' : 'normal',
        status: 'ordered'
      }, { transaction });
    } else if (routed_to === 'radiology') {
      await RadiologyOrder.create({
        prescription_item_id: pItem.id,
        patient_id: patientId,
        ordered_by: doctorId,
        scan_type: item.type,
        body_part: item.item_name,
        clinical_indication: item.instructions,
        priority: item.is_urgent ? 'urgent' : 'normal',
        status: 'ordered'
      }, { transaction });
    }

    // 3. Emit Real-Time Socket Event to the Target Department
    try {
      const io = getIo();
      
      // Determine role channel
      let targetRoleChannel = `role:${routed_to}`; // Fallback mapping
      if (routed_to === 'pharmacy') targetRoleChannel = 'role:pharmacist';
      if (routed_to === 'nursing') targetRoleChannel = 'role:nurse';
      if (routed_to === 'lab') targetRoleChannel = 'role:lab_tech';
      if (routed_to === 'radiology') targetRoleChannel = 'role:radiologist';

      io.to(targetRoleChannel).emit('new_order', {
        message: `New ${item.type} order received`,
        item: pItem,
        patientId
      });
      console.log(`[SOCKET] Emitted new_order to ${targetRoleChannel}`);
      
    } catch (err) {
      console.error('Socket emission failed during prescription routing:', err.message);
      // We don't fail the transaction if just the socket fails, silent catch.
    }
  }

  return createdItems;
};

module.exports = { routePrescriptionItems };
