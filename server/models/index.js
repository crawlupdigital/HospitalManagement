const sequelize = require('../config/db');

const Department = require('./Department.model');
const User = require('./User.model');
const Patient = require('./Patient.model');
const Appointment = require('./Appointment.model');
const Vital = require('./Vital.model');
const Prescription = require('./Prescription.model');
const PrescriptionItem = require('./PrescriptionItem.model');
const Medicine = require('./Medicine.model');
const Dispensing = require('./Dispensing.model');
const NursingTask = require('./NursingTask.model');
const LabOrder = require('./LabOrder.model');
const LabResult = require('./LabResult.model');
const RadiologyOrder = require('./RadiologyOrder.model');
const Invoice = require('./Invoice.model');
const Payment = require('./Payment.model');
const BloodInventory = require('./BloodInventory.model');
const BloodDonor = require('./BloodDonor.model');
const BloodRequest = require('./BloodRequest.model');
const Ambulance = require('./Ambulance.model');
const AmbulanceTrip = require('./AmbulanceTrip.model');
const Bed = require('./Bed.model');
const BedAllocation = require('./BedAllocation.model');
const Ward = require('./Ward.model');
const InsuranceClaim = require('./InsuranceClaim.model');
const PatientJourney = require('./PatientJourney.model');
const Notification = require('./Notification.model');
const AuditLog = require('./AuditLog.model');
const Event = require('./Event.model');
const FeatureUsage = require('./FeatureUsage.model');
const WaitTimeLog = require('./WaitTimeLog.model');
const KpiSnapshot = require('./KpiSnapshot.model');
const SavedQuery = require('./SavedQuery.model');
const ScheduledReport = require('./ScheduledReport.model');
const StaffPerformance = require('./StaffPerformance.model');
const BottleneckAlert = require('./BottleneckAlert.model');
const Visitor = require('./Visitor.model');



// ─── Define Associations ────────────────────────────────────────────

// Patient associations
Patient.hasMany(Vital, { foreignKey: 'patient_id' });
Vital.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(User, { foreignKey: 'doctor_id' });

// Visitor associations
Visitor.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Visitor, { foreignKey: 'patient_id' });
Appointment.belongsTo(Visitor, { foreignKey: 'visitor_id' });
Visitor.hasMany(Appointment, { foreignKey: 'visitor_id' });

Patient.hasMany(Prescription, { foreignKey: 'patient_id' });
Prescription.belongsTo(Patient, { foreignKey: 'patient_id' });
Prescription.belongsTo(User, { foreignKey: 'doctor_id' });

Prescription.hasMany(PrescriptionItem, { foreignKey: 'prescription_id' });
PrescriptionItem.belongsTo(Prescription, { foreignKey: 'prescription_id' });

// Lab associations
LabOrder.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(LabOrder, { foreignKey: 'patient_id' });
LabOrder.hasMany(LabResult, { foreignKey: 'lab_order_id' });
LabResult.belongsTo(LabOrder, { foreignKey: 'lab_order_id' });
LabOrder.belongsTo(PrescriptionItem, { foreignKey: 'prescription_item_id' });

// Radiology associations
RadiologyOrder.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(RadiologyOrder, { foreignKey: 'patient_id' });
RadiologyOrder.belongsTo(PrescriptionItem, { foreignKey: 'prescription_item_id' });

// Pharmacy associations
Dispensing.belongsTo(Medicine, { foreignKey: 'medicine_id' });
Dispensing.belongsTo(Patient, { foreignKey: 'patient_id' });
Dispensing.belongsTo(PrescriptionItem, { foreignKey: 'prescription_item_id' });

// Billing associations
Invoice.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Invoice, { foreignKey: 'patient_id' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id' });
Invoice.hasMany(Payment, { foreignKey: 'invoice_id' });

// Insurance
InsuranceClaim.belongsTo(Patient, { foreignKey: 'patient_id' });
InsuranceClaim.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// ICU / Beds
Bed.belongsTo(Ward, { foreignKey: 'ward_id' });
Ward.hasMany(Bed, { foreignKey: 'ward_id' });
BedAllocation.belongsTo(Bed, { foreignKey: 'bed_id' });
BedAllocation.belongsTo(Patient, { foreignKey: 'patient_id' });

// Ambulance
AmbulanceTrip.belongsTo(Ambulance, { foreignKey: 'ambulance_id' });
Ambulance.hasMany(AmbulanceTrip, { foreignKey: 'ambulance_id' });

// User / Department
User.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(User, { foreignKey: 'department_id' });

// Blood Bank
BloodRequest.belongsTo(Patient, { foreignKey: 'patient_id' });

// ─── End Associations ──────────────────────────────────────────────

module.exports = {
  sequelize,
  Department,
  User,
  Patient,
  Appointment,
  Vital,
  Prescription,
  PrescriptionItem,
  Medicine,
  Dispensing,
  NursingTask,
  LabOrder,
  LabResult,
  RadiologyOrder,
  Invoice,
  Payment,
  BloodInventory,
  BloodDonor,
  BloodRequest,
  Ambulance,
  AmbulanceTrip,
  Bed,
  BedAllocation,
  Ward,
  InsuranceClaim,
  PatientJourney,
  Notification,
  AuditLog,
  Event,
  FeatureUsage,
  WaitTimeLog,
  KpiSnapshot,
  SavedQuery,
  ScheduledReport,
  StaffPerformance,
  BottleneckAlert,
  Visitor,
};
