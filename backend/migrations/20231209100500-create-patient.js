'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patient', {
      patient_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      medical_conditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('stable', 'critical', 'moderate','Stable', 'Critical', 'Moderate'),  
        allowNull: false,
      },
      emergency_contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      assigned_caregiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,  // If this field is optional
      },

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patient');
  },
};