const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  doctor_id: {
    type: DataTypes.INTEGER
  },
  appointment_id: {
    type: DataTypes.INTEGER
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clinical_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  follow_up_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('DRAFT','ACTIVE','COMPLETED','CANCELLED'),
    defaultValue: 'ACTIVE'
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'prescriptions',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Prescription;
