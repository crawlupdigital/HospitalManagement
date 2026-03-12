const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ambulance = sequelize.define('Ambulance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_no: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('BASIC','ADVANCED','ICU_MOBILE'),
    defaultValue: 'BASIC'
  },
  driver_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  driver_phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'EN_ROUTE', 'BUSY', 'MAINTENANCE'),
    defaultValue: 'AVAILABLE'
  },
  current_location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  gps_lat: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  gps_lng: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ambulances',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Ambulance;
