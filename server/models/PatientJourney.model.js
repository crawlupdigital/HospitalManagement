const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PatientJourney = sequelize.define('PatientJourney', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  stage: {
    type: DataTypes.ENUM('RECEPTION','TRIAGE','CONSULTATION','PHARMACY','NURSING','LAB','RADIOLOGY','BILLING','DISCHARGED','ADMITTED'),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  handled_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entered_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'patient_journey',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = PatientJourney;
