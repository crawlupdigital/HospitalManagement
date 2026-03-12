module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_id: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('CASH','CARD','UPI','NETBANKING','INSURANCE','WALLET'),
        allowNull: false
      },
      transaction_ref: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      received_by: {
        type: Sequelize.INTEGER
      },
      paid_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
