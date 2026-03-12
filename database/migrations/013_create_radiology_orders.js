module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('radiology_orders', {
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
      ordered_by: {
        type: Sequelize.INTEGER
      },
      scan_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      body_part: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      clinical_indication: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('NORMAL','URGENT','CRITICAL'),
        defaultValue: 'NORMAL'
      },
      status: {
        type: Sequelize.ENUM('ORDERED','SCHEDULED','IN-PROGRESS','COMPLETED','CANCELLED'),
        defaultValue: 'ORDERED'
      },
      report_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      report_file_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      reported_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('radiology_orders');
  }
};
