'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('device', {
      device_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      device_type: {
        type: Sequelize.ENUM('Wearable', 'Camera'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Connected', 'Disconnected'),
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'patient',
          key: 'patient_id',
        },
        onDelete: 'CASCADE',
      },
      last_sync_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('device');
  },
};
