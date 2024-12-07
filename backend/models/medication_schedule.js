'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicationSchedule extends Model {
    static associate(models) {
      // A medication schedule is associated with one patient
      MedicationSchedule.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient', // Alias for the patient associated with this medication schedule
      });
    }
  }

  MedicationSchedule.init(
    {
      schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-increment the schedule ID
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key linking the medication schedule to the patient
        references: {
          model: 'patients', // References the Patient model
          key: 'patient_id', // References the primary key of the patients table
        },
        onDelete: 'CASCADE', // If the patient is deleted, delete the associated medication schedule
      },
      medication_name: {
        type: DataTypes.STRING,
        allowNull: false, // Name of the medication
      },
      dosage: {
        type: DataTypes.STRING, // Dosage can be a string (e.g., "2 pills", "500 mg")
        allowNull: false,
      },
      interval: {
        type: DataTypes.STRING, // Interval for taking the medication (e.g., "every 4 hours", "once a day")
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING, // Duration for which the medication should be taken (e.g., "7 days", "2 weeks")
        allowNull: false,
      },
      next_dose_time: {
        type: DataTypes.DATE, // Timestamp for the next dose time
        allowNull: false, // Next scheduled dose time
      },
    },
    {
      sequelize,
      modelName: 'MedicationSchedule',
      tableName: 'medication_schedules', // Name of the table storing medication schedules
    }
  );

  return MedicationSchedule;
};
