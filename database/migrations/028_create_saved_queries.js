module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saved_queries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      filters: {
        type: Sequelize.JSON,
        allowNull: false
      },
      columns: {
        type: Sequelize.JSON,
        allowNull: false
      },
      sort_by: {
        type: Sequelize.JSON,
        allowNull: true
      },
      group_by: {
        type: Sequelize.JSON,
        allowNull: true
      },
      aggregations: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_shared: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_scheduled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      last_run_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('saved_queries');
  }
};
