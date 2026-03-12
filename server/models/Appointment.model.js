const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  token_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('WALK-IN','SCHEDULED','EMERGENCY','FOLLOW-UP'),
    defaultValue: 'WALK-IN'
  },
  status: {
    type: DataTypes.ENUM('WAITING','IN-PROGRESS','COMPLETED','CANCELLED','NO-SHOW'),
    defaultValue: 'WAITING'
  },
  chief_complaint: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('NORMAL','URGENT','EMERGENCY'),
    defaultValue: 'NORMAL'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checked_in_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  consultation_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  consultation_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'appointments',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Appointment;
