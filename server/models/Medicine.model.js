const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medicine = sequelize.define('Medicine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  generic_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  batch_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reorder_level: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  storage_location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  requires_prescription: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'medicines',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Medicine;
