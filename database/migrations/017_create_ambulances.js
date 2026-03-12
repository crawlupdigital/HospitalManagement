module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ambulances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      vehicle_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('BASIC','ADVANCED','ICU_MOBILE'),
        defaultValue: 'BASIC'
      },
      driver_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      driver_phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 'AVAILABLE'
      },
      current_location: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      gps_lat: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      gps_lng: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ambulances');
  }
};
