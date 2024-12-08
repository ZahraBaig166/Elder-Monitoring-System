'use strict';
const { Model, DataTypes } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class HealthMetric extends Model {
    static associate(models) {
      // A health metric belongs to a patient
      HealthMetric.belongsTo(models.Patient, {
        foreignKey: 'patient_id', // Foreign key in the HealthMetric model
        as: 'patient', // Alias for the associated patient
      });
    }
  }
  HealthMetric.init(
    {
      metric_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Patient', // Reference the Sequelize model, not the table name
          key: 'patient_id', // Foreign key in the Patient model
        },
        allowNull: false,
      },
      heart_rate: {
        type: DataTypes.INTEGER,
        allowNull: true, // Heart rate can be nullable
      },
      activity_level: {
        type: DataTypes.STRING,
        allowNull: true, 
        // Activity level can be nullable (e.g., 'low', 'medium', 'high')
      },
      sleep_duration: {
        type: DataTypes.INTEGER, // Duration in hours
        allowNull: true,
      },
      time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      steps: {
        type: DataTypes.INTEGER,
        allowNull: true,  

    },
    intensity: {  
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
  },

    {
      sequelize,
      modelName: 'HealthMetric',
      tableName: 'health_metrics', // Name of the table
    }
  );

  return HealthMetric;
};
