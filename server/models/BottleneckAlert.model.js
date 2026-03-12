const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BottleneckAlert = sequelize.define('BottleneckAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alert_type: {
    type: DataTypes.ENUM('QUEUE_OVERFLOW','LONG_WAIT','STAFF_SHORTAGE','BED_SHORTAGE','STOCK_LOW','SYSTEM_ERROR'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metric_key: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  threshold_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  actual_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  suggested_action: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resolved_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  detected_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'bottleneck_alerts',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = BottleneckAlert;
