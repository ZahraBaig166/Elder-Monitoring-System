'use strict';
const { DataTypes } = require('sequelize');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // Each patient is assigned to one caregiver (one-to-many relationship)
      Patient.belongsTo(models.Caregiver, {
        foreignKey: 'assigned_caregiver_id',
        as: 'caregiver', // Alias for the caregiver relationship
      });
      Patient.hasMany(models.LocationHistory, {
        foreignKey: 'patient_id',
        as: 'locationHistories', // Alias for the location histories associated with a patient
      });
      Patient.hasMany(models.Device, {
        foreignKey: 'patient_id',
        as: 'devices', // Alias for the devices associated with a patient
      });
      Patient.hasMany(models.MedicationSchedule, {
        foreignKey: 'patient_id',
        as: 'medicationSchedules', // Alias for the medication schedules associated with a patient
      });
      Patient.hasMany(models.Alert, {
        foreignKey: 'patient_id', // Foreign key in the Alert model
        as: 'alerts', // Alias for the associated alerts
      });
      Patient.hasMany(models.HealthMetric, {
        foreignKey: 'patient_id', // Foreign key in the HealthMetric model
        as: 'healthMetrics', // Alias for accessing the health metrics of a patient
      });
      
    }
  }

  Patient.init(
    {
      patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments the patient_id
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Patient's name is required
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false, // Age is required
      },
      medical_conditions: {
        type: DataTypes.TEXT,
        allowNull: true, // Medical conditions may be nullable
      },
      status: {
        type: DataTypes.ENUM('stable', 'critical', 'moderate'),
        allowNull: false, // Status is required, with defined possible values
      },
      emergency_contact: {
        type: DataTypes.STRING,
        allowNull: false, // Emergency contact is required
      },
      assigned_caregiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key to the caregiver table
        references: {
          model: 'caregivers', // The model that the foreign key references (caregivers table)
          key: 'id', // Reference the primary key in the caregivers table
        },
      },
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'patients', // Name of the table to store patient information
    }
  );

  return Patient;
};
