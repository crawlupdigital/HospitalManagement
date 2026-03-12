const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BedAllocation = sequelize.define('BedAllocation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bed_id: { type: DataTypes.INTEGER, allowNull: false },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  allocated_by: { type: DataTypes.INTEGER },
  admission_date: { type: DataTypes.DATE },
  discharge_date: { type: DataTypes.DATE }
}, {
  tableName: 'bed_allocations',
  timestamps: true,
  underscored: true
});

module.exports = BedAllocation;
