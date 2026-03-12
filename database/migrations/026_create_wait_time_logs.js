module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wait_time_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      stage: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      entered_stage_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      exited_stage_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      wait_duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      served_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wait_time_logs');
  }
};
