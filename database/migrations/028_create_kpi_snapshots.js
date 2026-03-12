module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kpi_snapshots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      snapshot_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      snapshot_hour: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      metric_key: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      metric_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kpi_snapshots');
  }
};
