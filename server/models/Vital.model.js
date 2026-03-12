const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vital = sequelize.define('Vital', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recorded_by: {
    type: DataTypes.INTEGER
  },
  blood_pressure_sys: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  blood_pressure_dia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  pulse_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spo2: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  respiratory_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weight_kg: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: true
  },
  height_cm: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: true
  },
  blood_sugar: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recorded_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'vitals',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Vital;
