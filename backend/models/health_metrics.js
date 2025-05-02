'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HealthMetric extends Model {
    static associate(models) {
      HealthMetric.belongsTo(models.Patient, {
        foreignKey: 'patient_id', // Foreign key in health_metrics
        as: 'patient', // Alias for the relationship
      });
    }
  }

  HealthMetric.init(
    { id:{
       type: DataTypes.BIGINT,
       primaryKey: true,
       autoIncrement: true,
       allowNull:false,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      intensity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      steps: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sleep_stage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      accel_x_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      accel_y_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      accel_z_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gyro_x_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gyro_y_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gyro_z_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      orientation_s_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      orientation_i_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      orientation_j_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      orientation_k_list: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fall: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'HealthMetric',
      tableName: 'health_metrics',
      timestamps: false,  
    }
  );
  return HealthMetric;
};
