const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const INDEX STRATEGY: Composite indexes on (userId, createdAt), (entityType, entityId, createdAt), (category, eventType, createdAt), (sessionId, createdAt) for fast analytics query = sequelize.define('INDEX STRATEGY: Composite indexes on (userId, createdAt), (entityType, entityId, createdAt), (category, eventType, createdAt), (sessionId, createdAt) for fast analytics query', {
   Partition by month for tables exceeding 10M rows: {
    type: DataTypes.STRING
  },
  Type: {
    type: DataTypes.INTEGER
  },
  INT: {
    type: DataTypes.STRING
  },
  VARCHAR(36): {
    type: DataTypes.STRING
  },
  INT: {
    type: DataTypes.STRING
  },
  TIMESTAMP: {
    type: DataTypes.STRING
  },
  TIMESTAMP: {
    type: DataTypes.STRING,
    allowNull: true
  },
  INT: {
    type: DataTypes.STRING
  },
  INT: {
    type: DataTypes.STRING
  },
  INT: {
    type: DataTypes.STRING
  },
  VARCHAR(45): {
    type: DataTypes.STRING
  },
  VARCHAR(20): {
    type: DataTypes.STRING
  },
  VARCHAR(100): {
    type: DataTypes.STRING
  },
  VARCHAR(100): {
    type: DataTypes.STRING
  },
  BOOLEAN: {
    type: DataTypes.STRING
  },
  Column: {
    type: DataTypes.STRING
  },
  ---: {
    type: DataTypes.STRING
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  session_id: {
    type: DataTypes.STRING(36)
  },
  page_path: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  page_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  referrer_path: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  entered_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  exited_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  time_on_page_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  scroll_depth_percent: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  interactions_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'INDEX STRATEGY: Composite indexes on (user_id, created_at), (entity_type, entity_id, created_at), (category, event_type, created_at), (session_id, created_at) for fast analytics queries',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = INDEX STRATEGY: Composite indexes on (userId, createdAt), (entityType, entityId, createdAt), (category, eventType, createdAt), (sessionId, createdAt) for fast analytics query;
