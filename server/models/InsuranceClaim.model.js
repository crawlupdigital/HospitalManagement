const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InsuranceClaim = sequelize.define('InsuranceClaim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  insurance_provider_id: {
    type: DataTypes.INTEGER
  },
  policy_no: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  claim_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  approved_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','SETTLED'),
    defaultValue: 'SUBMITTED'
  },
  tpa_reference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'insurance_claims',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = InsuranceClaim;
