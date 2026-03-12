const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_uid: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('MALE','FEMALE','OTHER'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  alt_phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  blood_group: {
    type: DataTypes.ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    allowNull: true
  },
  aadhar_no: {
    type: DataTypes.STRING(12),
    allowNull: true,
    unique: true
  },
  emergency_contact_name: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  insurance_provider_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  insurance_policy_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  chronic_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  current_stage: {
    type: DataTypes.ENUM('reception', 'triage', 'consultation', 'pharmacy', 'nursing', 'lab', 'radiology', 'billing', 'discharged', 'admitted'),
    defaultValue: 'reception'
  },
  is_admitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  registered_by: {
    type: DataTypes.INTEGER
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'patients',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Patient;
