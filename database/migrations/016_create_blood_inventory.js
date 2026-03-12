module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blood_inventory', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      blood_group: {
        type: Sequelize.ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
        allowNull: false
      },
      component: {
        type: Sequelize.ENUM('WHOLE_BLOOD','PACKED_RBC','PLASMA','PLATELETS'),
        allowNull: false
      },
      units_available: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      collection_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      donor_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE','RESERVED','EXPIRED','USED'),
        defaultValue: 'AVAILABLE'
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blood_inventory');
  }
};
