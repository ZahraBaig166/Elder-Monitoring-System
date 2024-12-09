'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicationSchedule extends Model {
    static associate(models) {
      MedicationSchedule.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    }
  }
  MedicationSchedule.init(
    {
      schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: DataTypes.BIGINT,
      medication_name: DataTypes.STRING,
      dosage: DataTypes.STRING,
      interval: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      next_dose_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'medication_schedule',
      tableName: 'medication_schedule',
    }
  );
  return MedicationSchedule;
};
