const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('USER_ACTION','NAVIGATION','DATA_CHANGE','WORKFLOW','SYSTEM','ALERT'),
    allowNull: false
  },
  event_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  user_role: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  session_id: {
    type: DataTypes.STRING(36)
  },
  page_path: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  component: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  element_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  changed_fields: {
    type: DataTypes.JSON,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  device_type: {
    type: DataTypes.ENUM('DESKTOP','TABLET','MOBILE'),
    allowNull: true
  },
  duration_ms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'events',
  timestamps: false, // We will manually handle created_at / updated_at if defined
});

module.exports = Event;
