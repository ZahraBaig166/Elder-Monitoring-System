'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caregiver extends Model {
    static associate(models) {
      // A caregiver can have many queries raised by them
      Caregiver.hasMany(models.Query, {
        foreignKey: 'raised_by',
        as: 'query', // Alias to fetch queries raised by the caregiver
      });

      // A caregiver can be assigned to many patients
      Caregiver.hasMany(models.Patient, {
        foreignKey: 'assigned_caregiver_id',
        as: 'patient', // Alias for the patients associated with a caregiver
      });
  }
  }
  Caregiver.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      age: DataTypes.INTEGER,
      address: DataTypes.STRING,
      education: DataTypes.STRING,
      password: DataTypes.STRING,
      date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      last_login: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'caregiver',
      tableName: 'caregiver',
      timestamps: false,
    }
  );
  return Caregiver;
};
