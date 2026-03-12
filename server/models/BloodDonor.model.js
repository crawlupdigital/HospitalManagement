const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BloodDonor = sequelize.define('BloodDonor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  blood_group: { type: DataTypes.STRING(5), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING(10) },
  age: { type: DataTypes.INTEGER },
  last_donation_date: { type: DataTypes.DATEONLY },
  is_eligible: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'blood_donors',
  timestamps: true,
  underscored: true
});

module.exports = BloodDonor;
