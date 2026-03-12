module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('staff_performance', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      patients_handled: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tasks_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      avg_handling_time_mins: {
        type: Sequelize.DECIMAL(6, 1),
        allowNull: true
      },
      avg_patient_rating: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: true
      },
      login_duration_mins: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      idle_time_mins: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      errors_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      prescriptions_written: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      medicines_dispensed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tests_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('staff_performance');
  }
};
