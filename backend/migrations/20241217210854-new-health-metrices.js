'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('health_metrics', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'patient', // Name of the referenced table
          key: 'patient_id', // Primary key in the patients table
        },
        onUpdate: 'CASCADE', // Adjust as needed (CASCADE, RESTRICT, etc.)
        onDelete: 'CASCADE', // Adjust as needed (SET NULL, CASCADE, etc.)
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      intensity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      calories: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      steps: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      sleep_stage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      accel_x_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      accel_y_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      accel_z_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      gyro_x_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      gyro_y_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      gyro_z_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      orientation_s_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      orientation_i_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      orientation_j_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      orientation_k_list: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      fall: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('health_metrics');
  },
};