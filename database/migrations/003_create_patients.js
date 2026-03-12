module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patient_uid: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('MALE','FEMALE','OTHER'),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      alt_phone: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      blood_group: {
        type: Sequelize.ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
        allowNull: true
      },
      aadhar_no: {
        type: Sequelize.STRING(12),
        allowNull: true,
        unique: true
      },
      emergency_contact_name: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      emergency_contact_phone: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      insurance_provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      insurance_policy_no: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      chronic_conditions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      current_stage: {
        type: Sequelize.ENUM(...),
        defaultValue: 'RECEPTION'
      },
      is_admitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      registered_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patients');
  }
};
