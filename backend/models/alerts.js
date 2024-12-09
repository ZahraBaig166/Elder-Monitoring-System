'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Alerts extends Model {
    static associate(models) {
      // Ensure models.Patient is a valid Sequelize model
      Alerts.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient',
      });
    }
  }
  Alerts.init(
    {
      alert_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_acknowledged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Alerts',
      tableName: 'alerts',
    }
  );

  return Alerts;
};
