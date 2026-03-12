const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BloodInventory = sequelize.define('BloodInventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blood_group: {
    type: DataTypes.ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    allowNull: false
  },
  component: {
    type: DataTypes.ENUM('WHOLE_BLOOD','PACKED_RBC','PLASMA','PLATELETS'),
    allowNull: false
  },
  units_available: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  collection_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE','RESERVED','EXPIRED','USED'),
    defaultValue: 'AVAILABLE'
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'blood_inventory',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = BloodInventory;
