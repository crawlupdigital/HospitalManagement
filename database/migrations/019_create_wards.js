module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('GENERAL','SEMI_PRIVATE','PRIVATE','ICU','NICU','PICU'),
        allowNull: false
      },
      floor: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      total_beds: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      charge_per_day: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wards');
  }
};
