const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bed = sequelize.define('Bed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ward_id: {
    type: DataTypes.INTEGER
  },
  bed_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  has_ventilator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  has_monitor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE'),
    defaultValue: 'AVAILABLE'
  }
}, {
  tableName: 'beds',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Bed;
