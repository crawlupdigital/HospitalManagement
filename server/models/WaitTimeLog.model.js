const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WaitTimeLog = sequelize.define('WaitTimeLog', {
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
    type: DataTypes.STRING(30),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  entered_stage_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  exited_stage_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  wait_duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  served_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'wait_time_logs',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = WaitTimeLog;
