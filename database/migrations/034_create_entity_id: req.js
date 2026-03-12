module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entity_id: req', {
      params: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('entity_id: req');
  }
};
