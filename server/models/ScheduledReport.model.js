const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ScheduledReport = sequelize.define('ScheduledReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  report_type: {
    type: DataTypes.ENUM('KPI_SUMMARY','PATIENT_FLOW','REVENUE','DEPARTMENT_LOAD','STAFF_PERFORMANCE','CUSTOM_QUERY'),
    allowNull: false
  },
  saved_query_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  schedule: {
    type: DataTypes.ENUM('DAILY','WEEKLY','MONTHLY'),
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  day_of_month: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  time_of_day: {
    type: DataTypes.TIME,
    defaultValue: '08:00:00'
  },
  format: {
    type: DataTypes.ENUM('PDF','EXCEL','CSV','EMAIL_BODY'),
    defaultValue: 'PDF'
  },
  recipients: {
    type: DataTypes.JSON,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_generated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'scheduled_reports',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = ScheduledReport;
