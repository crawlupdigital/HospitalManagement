module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vitals', {
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
      recorded_by: {
        type: Sequelize.INTEGER
      },
      blood_pressure_sys: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      blood_pressure_dia: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      temperature: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true
      },
      pulse_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      spo2: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      respiratory_rate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      weight_kg: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: true
      },
      height_cm: {
        type: Sequelize.DECIMAL(5, 1),
        allowNull: true
      },
      blood_sugar: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recorded_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vitals');
  }
};
