module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER
      },
      appointment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      appointment_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      token_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('WALK-IN','SCHEDULED','EMERGENCY','FOLLOW-UP'),
        defaultValue: 'WALK-IN'
      },
      status: {
        type: Sequelize.ENUM('WAITING','IN-PROGRESS','COMPLETED','CANCELLED','NO-SHOW'),
        defaultValue: 'WAITING'
      },
      chief_complaint: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('NORMAL','URGENT','EMERGENCY'),
        defaultValue: 'NORMAL'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      checked_in_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      consultation_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      consultation_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};
