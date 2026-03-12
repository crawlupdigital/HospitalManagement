const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NursingTask = sequelize.define('NursingTask', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescription_item_id: {
    type: DataTypes.INTEGER
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  assigned_nurse_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  task_type: {
    type: DataTypes.ENUM('INJECTION','IV_DRIP','DRESSING','VITALS','OBSERVATION'),
    allowNull: false
  },
  task_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('NORMAL','URGENT','CRITICAL'),
    defaultValue: 'NORMAL'
  },
  status: {
    type: DataTypes.ENUM('PENDING','IN-PROGRESS','COMPLETED','CANCELLED'),
    defaultValue: 'PENDING'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'nursing_tasks',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = NursingTask;
