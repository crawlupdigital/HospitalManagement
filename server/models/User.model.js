const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'receptionist', 'doctor', 'nurse', 'pharmacist', 'lab_tech', 'radiologist', 'billing', 'blood_bank_tech', 'ambulance', 'icu_manager', 'insurance'),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER
  },
  specialization: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  license_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = User;
