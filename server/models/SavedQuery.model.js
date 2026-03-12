const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SavedQuery = sequelize.define('SavedQuery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  filters: {
    type: DataTypes.JSON,
    allowNull: false
  },
  columns: {
    type: DataTypes.JSON,
    allowNull: false
  },
  sort_by: {
    type: DataTypes.JSON,
    allowNull: true
  },
  group_by: {
    type: DataTypes.JSON,
    allowNull: true
  },
  aggregations: {
    type: DataTypes.JSON,
    allowNull: true
  },
  is_shared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_scheduled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_run_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'saved_queries',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = SavedQuery;
