const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeatureUsage = sequelize.define('FeatureUsage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  feature_key: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  feature_category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  used_at: {
    type: DataTypes.DATE
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  context: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'feature_usage',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = FeatureUsage;
