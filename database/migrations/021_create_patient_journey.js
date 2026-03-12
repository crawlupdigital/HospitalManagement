module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_journey', {
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
        type: Sequelize.ENUM('RECEPTION','TRIAGE','CONSULTATION','PHARMACY','NURSING','LAB','RADIOLOGY','BILLING','DISCHARGED','ADMITTED'),
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      handled_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      action: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      entered_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patient_journey');
  }
};
