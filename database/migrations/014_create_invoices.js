module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invoice_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      consultation_fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      medicine_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      lab_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      radiology_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      nursing_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      bed_charges: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      other_charges: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      grand_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      insurance_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      patient_payable: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('DRAFT','PENDING','PAID','PARTIAL','CANCELLED'),
        defaultValue: 'PENDING'
      },
      generated_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('invoices');
  }
};
