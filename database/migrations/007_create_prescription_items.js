module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescription_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      prescription_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('MEDICINE','INJECTION','LAB_TEST','XRAY','IMAGING','PROCEDURE'),
        allowNull: false
      },
      item_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      dosage: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      frequency: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      route: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      is_urgent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      routed_to: {
        type: Sequelize.ENUM('PHARMACY','NURSING','LAB','RADIOLOGY'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING','PROCESSING','COMPLETED','CANCELLED'),
        defaultValue: 'PENDING'
      },
      completed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prescription_items');
  }
};
