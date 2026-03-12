const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PrescriptionItem = sequelize.define('PrescriptionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescription_id: {
    type: DataTypes.INTEGER
  },
  type: {
    type: DataTypes.ENUM('MEDICINE','INJECTION','LAB_TEST','XRAY','IMAGING','PROCEDURE'),
    allowNull: false
  },
  item_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  frequency: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  route: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  routed_to: {
    type: DataTypes.ENUM('PHARMACY','NURSING','LAB','RADIOLOGY'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING','PROCESSING','COMPLETED','CANCELLED'),
    defaultValue: 'PENDING'
  },
  completed_by: {
    type: DataTypes.INTEGER,
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
  tableName: 'prescription_items',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = PrescriptionItem;
