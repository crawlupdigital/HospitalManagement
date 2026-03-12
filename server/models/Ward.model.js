const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ward = sequelize.define('Ward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('GENERAL','SEMI_PRIVATE','PRIVATE','ICU','NICU','PICU'),
    allowNull: false
  },
  floor: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  total_beds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  charge_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'wards',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Ward;
