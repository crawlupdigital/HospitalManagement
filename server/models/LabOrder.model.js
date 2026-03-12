const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LabOrder = sequelize.define('LabOrder', {
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
  test_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  test_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sample_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sample_collected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sample_collected_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sample_collected_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('NORMAL','URGENT','CRITICAL'),
    defaultValue: 'NORMAL'
  },
  status: {
    type: DataTypes.ENUM('ORDERED','SAMPLE_COLLECTED','PROCESSING','COMPLETED','CANCELLED'),
    defaultValue: 'ORDERED'
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'lab_orders',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = LabOrder;
