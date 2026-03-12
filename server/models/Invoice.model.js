const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_no: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  medicine_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  lab_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  radiology_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  nursing_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  bed_charges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  other_charges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  grand_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  insurance_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  patient_payable: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT','PENDING','PAID','PARTIAL','CANCELLED'),
    defaultValue: 'PENDING'
  },
  generated_by: {
    type: DataTypes.INTEGER
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'invoices',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Invoice;
