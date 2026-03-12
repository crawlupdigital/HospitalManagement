const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BloodRequest = sequelize.define('BloodRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER },
  blood_group: { type: DataTypes.STRING(5), allowNull: false },
  units_requested: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  reason: { type: DataTypes.STRING },
  priority: { type: DataTypes.ENUM('normal', 'urgent', 'emergency'), defaultValue: 'normal' },
  status: { type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'), defaultValue: 'pending' },
  requested_by: { type: DataTypes.INTEGER },
  fulfilled_by: { type: DataTypes.INTEGER },
  fulfilled_at: { type: DataTypes.DATE }
}, {
  tableName: 'blood_requests',
  timestamps: true,
  underscored: true
});

module.exports = BloodRequest;
