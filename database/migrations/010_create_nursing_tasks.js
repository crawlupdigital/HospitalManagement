module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nursing_tasks', {
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
      assigned_nurse_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      task_type: {
        type: Sequelize.ENUM('INJECTION','IV_DRIP','DRESSING','VITALS','OBSERVATION'),
        allowNull: false
      },
      task_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('NORMAL','URGENT','CRITICAL'),
        defaultValue: 'NORMAL'
      },
      status: {
        type: Sequelize.ENUM('PENDING','IN-PROGRESS','COMPLETED','CANCELLED'),
        defaultValue: 'PENDING'
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('nursing_tasks');
  }
};
