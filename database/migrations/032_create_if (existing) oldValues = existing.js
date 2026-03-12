module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('if (existing) oldValues = existing', {
      toJSON();: {
        type: Sequelize.STRING
      },
      // After response, log the event asynchronously: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('if (existing) oldValues = existing');
  }
};
