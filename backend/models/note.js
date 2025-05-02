'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      // Each note is added by a caregiver for a patient
      Note.belongsTo(models.Caregiver, {
        foreignKey: 'caregiver_id',
        as: 'caregiver',
      });
      Note.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }
  }

  Note.init(
    {
      note_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      caregiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'note',
      tableName: 'note',
      timestamps: false,
    }
  );

  return Note;
};
