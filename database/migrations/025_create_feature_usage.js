module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feature_usage', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      feature_key: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      feature_category: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      used_at: {
        type: Sequelize.DATE
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      context: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('feature_usage');
  }
};
