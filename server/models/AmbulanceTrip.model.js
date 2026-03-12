const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AmbulanceTrip = sequelize.define('AmbulanceTrip', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ambulance_id: { type: DataTypes.INTEGER, allowNull: false },
  pickup_location: { type: DataTypes.STRING },
  drop_location: { type: DataTypes.STRING },
  patient_info: { type: DataTypes.STRING },
  dispatched_by: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('dispatched', 'in_transit', 'completed', 'cancelled'), defaultValue: 'dispatched' },
  completed_at: { type: DataTypes.DATE }
}, {
  tableName: 'ambulance_trips',
  timestamps: true,
  underscored: true
});

module.exports = AmbulanceTrip;
