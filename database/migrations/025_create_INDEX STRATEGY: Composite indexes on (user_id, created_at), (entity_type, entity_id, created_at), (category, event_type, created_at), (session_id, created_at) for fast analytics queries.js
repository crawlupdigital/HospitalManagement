module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('INDEX STRATEGY: Composite indexes on (user_id, created_at), (entity_type, entity_id, created_at), (category, event_type, created_at), (session_id, created_at) for fast analytics queries', {
       Partition by month for tables exceeding 10M rows: {
        type: Sequelize.STRING
      },
      Type: {
        type: Sequelize.INTEGER
      },
      INT: {
        type: Sequelize.STRING
      },
      VARCHAR(36): {
        type: Sequelize.STRING
      },
      INT: {
        type: Sequelize.STRING
      },
      TIMESTAMP: {
        type: Sequelize.STRING
      },
      TIMESTAMP: {
        type: Sequelize.STRING,
        allowNull: true
      },
      INT: {
        type: Sequelize.STRING
      },
      INT: {
        type: Sequelize.STRING
      },
      INT: {
        type: Sequelize.STRING
      },
      VARCHAR(45): {
        type: Sequelize.STRING
      },
      VARCHAR(20): {
        type: Sequelize.STRING
      },
      VARCHAR(100): {
        type: Sequelize.STRING
      },
      VARCHAR(100): {
        type: Sequelize.STRING
      },
      BOOLEAN: {
        type: Sequelize.STRING
      },
      Column: {
        type: Sequelize.STRING
      },
      ---: {
        type: Sequelize.STRING
      },
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      session_id: {
        type: Sequelize.STRING(36)
      },
      page_path: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      page_title: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      referrer_path: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      entered_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      exited_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      time_on_page_seconds: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      scroll_depth_percent: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      interactions_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('INDEX STRATEGY: Composite indexes on (user_id, created_at), (entity_type, entity_id, created_at), (category, event_type, created_at), (session_id, created_at) for fast analytics queries');
  }
};
