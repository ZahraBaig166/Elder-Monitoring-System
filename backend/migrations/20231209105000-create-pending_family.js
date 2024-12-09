'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pending_family', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      relationship_to_patient: {
        type: Sequelize.STRING,
        allowNull: false, // E.g., mother, father, spouse, etc.
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Pending approval by default
      },
      date_created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
  
      // New patient-related fields
      patient_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      patient_age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      patient_medical_conditions: {
        type: Sequelize.STRING,
        allowNull: true, // Could be empty if there are no medical conditions
      },
      patient_status: {
        type: Sequelize.ENUM('stable', 'critical', 'moderate'),
        allowNull: false,
      },
      patient_emergency_contact: {
        type: Sequelize.STRING,
        allowNull: false, // Emergency contact information
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pending_family');
  },
};
