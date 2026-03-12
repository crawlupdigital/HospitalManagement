module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bottleneck_alerts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      alert_type: {
        type: Sequelize.ENUM('QUEUE_OVERFLOW','LONG_WAIT','STAFF_SHORTAGE','BED_SHORTAGE','STOCK_LOW','SYSTEM_ERROR'),
        allowNull: false
      },
      severity: {
        type: Sequelize.ENUM('LOW','MEDIUM','HIGH','CRITICAL'),
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      metric_key: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      threshold_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      actual_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      suggested_action: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      resolved_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      detected_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bottleneck_alerts');
  }
};
