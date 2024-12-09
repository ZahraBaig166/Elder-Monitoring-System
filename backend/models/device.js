'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      Device.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    }
  }
  Device.init(
    {
      device_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      device_type: {
        type: DataTypes.ENUM('Wearable', 'Camera'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Connected', 'Disconnected'),
        allowNull: false,
      },
      patient_id: DataTypes.INTEGER,
      last_sync_time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'device',
      tableName: 'device',
    }
  );
  return Device;
};
