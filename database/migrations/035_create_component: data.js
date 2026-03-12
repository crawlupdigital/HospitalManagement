module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('component: data', {
      component,: {
        type: Sequelize.STRING
      },
      });: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('component: data');
  }
};
