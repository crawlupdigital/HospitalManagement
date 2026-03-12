const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KpiSnapshot = sequelize.define('KpiSnapshot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  snapshot_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  snapshot_hour: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  metric_key: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  metric_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'kpi_snapshots',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = KpiSnapshot;
