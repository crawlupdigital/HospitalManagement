module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('scheduled_reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      report_type: {
        type: Sequelize.ENUM('KPI_SUMMARY','PATIENT_FLOW','REVENUE','DEPARTMENT_LOAD','STAFF_PERFORMANCE','CUSTOM_QUERY'),
        allowNull: false
      },
      saved_query_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      schedule: {
        type: Sequelize.ENUM('DAILY','WEEKLY','MONTHLY'),
        allowNull: false
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      day_of_month: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      time_of_day: {
        type: Sequelize.TIME,
        defaultValue: '08:00:00'
      },
      format: {
        type: Sequelize.ENUM('PDF','EXCEL','CSV','EMAIL_BODY'),
        defaultValue: 'PDF'
      },
      recipients: {
        type: Sequelize.JSON,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      last_generated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('scheduled_reports');
  }
};
