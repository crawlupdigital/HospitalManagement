module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      doctor_id: {
        type: Sequelize.INTEGER
      },
      appointment_id: {
        type: Sequelize.INTEGER
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      clinical_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      follow_up_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT','ACTIVE','COMPLETED','CANCELLED'),
        defaultValue: 'ACTIVE'
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prescriptions');
  }
};
