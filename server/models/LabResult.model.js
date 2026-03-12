const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LabResult = sequelize.define('LabResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lab_order_id: {
    type: DataTypes.INTEGER
  },
  parameter_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  result_value: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  normal_range: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_abnormal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  entered_by: {
    type: DataTypes.INTEGER
  },
  entered_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'lab_results',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = LabResult;
