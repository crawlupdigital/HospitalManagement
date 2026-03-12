const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RadiologyOrder = sequelize.define('RadiologyOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescription_item_id: {
    type: DataTypes.INTEGER
  },
  patient_id: {
    type: DataTypes.INTEGER
  },
  ordered_by: {
    type: DataTypes.INTEGER
  },
  scan_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  body_part: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  clinical_indication: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('NORMAL','URGENT','CRITICAL'),
    defaultValue: 'NORMAL'
  },
  status: {
    type: DataTypes.ENUM('ORDERED','SCHEDULED','IN-PROGRESS','COMPLETED','CANCELLED'),
    defaultValue: 'ORDERED'
  },
  report_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  report_file_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  reported_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'radiology_orders',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = RadiologyOrder;
