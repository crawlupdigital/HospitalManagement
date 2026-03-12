module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insurance_claims', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      insurance_provider_id: {
        type: Sequelize.INTEGER
      },
      policy_no: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      claim_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      approved_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','SETTLED'),
        defaultValue: 'SUBMITTED'
      },
      tpa_reference: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      submitted_at: {
        type: Sequelize.DATE
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('insurance_claims');
  }
};
