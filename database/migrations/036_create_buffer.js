module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('buffer', {
      current = [];: {
        type: Sequelize.STRING
      },
      // Flush on unmount and every 5s: {
        type: Sequelize.STRING
      },
      }, []);: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('buffer');
  }
};
