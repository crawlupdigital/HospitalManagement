module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true
      },
      category: {
        type: Sequelize.ENUM('USER_ACTION','NAVIGATION','DATA_CHANGE','WORKFLOW','SYSTEM','ALERT'),
        allowNull: false
      },
      event_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      user_role: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      session_id: {
        type: Sequelize.STRING(36)
      },
      page_path: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      component: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      element_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      action: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      old_values: {
        type: Sequelize.JSON,
        allowNull: true
      },
      new_values: {
        type: Sequelize.JSON,
        allowNull: true
      },
      changed_fields: {
        type: Sequelize.JSON,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      device_type: {
        type: Sequelize.ENUM('DESKTOP','TABLET','MOBILE'),
        allowNull: true
      },
      duration_ms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  }
};
