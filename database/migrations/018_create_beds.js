module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('beds', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      ward_id: {
        type: Sequelize.INTEGER
      },
      bed_number: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      has_ventilator: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      has_monitor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 'AVAILABLE'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('beds');
  }
};
