module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lab_results', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lab_order_id: {
        type: Sequelize.INTEGER
      },
      parameter_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      result_value: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      normal_range: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_abnormal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      entered_by: {
        type: Sequelize.INTEGER
      },
      entered_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lab_results');
  }
};
