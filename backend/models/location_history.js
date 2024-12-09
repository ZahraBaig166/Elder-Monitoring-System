'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LocationHistory extends Model {
    static associate(models) {
      LocationHistory.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    }
  }
  LocationHistory.init(
    {
      location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: DataTypes.BIGINT,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'location_history',
      tableName: 'location_history',
    }
  );
  return LocationHistory;
};
