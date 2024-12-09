'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HealthMetrics extends Model {
    static associate(models) {
      HealthMetrics.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    }
  }
  
  HealthMetrics.init(
    {
      metric_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: DataTypes.INTEGER,
      heart_rate: DataTypes.INTEGER,
      activity_level: DataTypes.STRING,
      sleep_duration: DataTypes.INTEGER,
      time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      
        // Disable createdAt and updatedAt
      
    },
    {
      sequelize,
      modelName: 'HealthMetric',
      tableName: 'health_metrics',
      timestamps: false,
    }
  );
  return HealthMetrics;
};
