module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medicines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      generic_name: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      manufacturer: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      batch_no: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reorder_level: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      storage_location: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      requires_prescription: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('medicines');
  }
};
