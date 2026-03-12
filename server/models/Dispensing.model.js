const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dispensing = sequelize.define('Dispensing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescription_item_id: {
    type: DataTypes.INTEGER
  },
  medicine_id: {
    type: DataTypes.INTEGER
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  dispensed_by: {
    type: DataTypes.INTEGER
  },
  quantity_dispensed: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DISPENSED','RETURNED','PARTIAL'),
    defaultValue: 'DISPENSED'
  },
  dispensed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'dispensings',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Dispensing;
