module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dispensings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      prescription_item_id: {
        type: Sequelize.INTEGER
      },
      medicine_id: {
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      dispensed_by: {
        type: Sequelize.INTEGER
      },
      quantity_dispensed: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('DISPENSED','RETURNED','PARTIAL'),
        defaultValue: 'DISPENSED'
      },
      dispensed_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dispensings');
  }
};
