const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StaffPerformance = sequelize.define('StaffPerformance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  patients_handled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tasks_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avg_handling_time_mins: {
    type: DataTypes.DECIMAL(6, 1),
    allowNull: true
  },
  avg_patient_rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true
  },
  login_duration_mins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  idle_time_mins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  errors_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  prescriptions_written: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  medicines_dispensed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tests_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'staff_performance',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = StaffPerformance;
