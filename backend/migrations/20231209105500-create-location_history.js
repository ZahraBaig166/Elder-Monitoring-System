'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('location_history', {
      location_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'patient', // Reference the patients table
          key: 'patient_id',
        },
        onDelete: 'CASCADE',
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('location_history');
  },
};
