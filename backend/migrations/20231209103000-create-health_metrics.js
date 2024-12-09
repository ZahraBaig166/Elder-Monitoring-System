'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('health_metrics', {
      metric_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'patient',
          key: 'patient_id',
        },
        onDelete: 'CASCADE',
      },
      heart_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      activity_level: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sleep_duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      calories: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      steps: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      intensity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('health_metrics');
  },
};
