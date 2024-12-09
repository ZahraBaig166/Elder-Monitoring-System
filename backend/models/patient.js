'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.Caregiver, { foreignKey: 'assigned_caregiver_id', as: 'caregiver' });
      Patient.hasMany(models.Device, { foreignKey: 'patient_id', as: 'devices' });
      Patient.hasMany(models.Alerts, { foreignKey: 'patient_id', as: 'alerts' });
      Patient.hasMany(models.MedicationSchedule, { foreignKey: 'patient_id', as: 'medications' });
      Patient.hasMany(models.HealthMetric, { foreignKey: 'patient_id', as: 'metrics' });
      Patient.hasMany(models.LocationHistory, { foreignKey: 'patient_id', as: 'locations' });
      
    }
  }
  Patient.init(
    {
      patient_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
         autoIncrement: true,
      },
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      medical_conditions: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('Stable', 'Critical', 'Moderate'),
        allowNull: false,
      },
      emergency_contact: DataTypes.STRING,
      // assigned_caregiver_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'patient',
    }
  );
  return Patient;
};
