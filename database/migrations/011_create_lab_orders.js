module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lab_orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      prescription_item_id: {
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      ordered_by: {
        type: Sequelize.INTEGER
      },
      test_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      test_category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sample_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      sample_collected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sample_collected_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sample_collected_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('NORMAL','URGENT','CRITICAL'),
        defaultValue: 'NORMAL'
      },
      status: {
        type: Sequelize.ENUM('ORDERED','SAMPLE_COLLECTED','PROCESSING','COMPLETED','CANCELLED'),
        defaultValue: 'ORDERED'
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lab_orders');
  }
};
