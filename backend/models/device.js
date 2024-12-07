'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      // A device is associated with one patient
      Device.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient', // Alias for the patient associated with this device
      });
    }
  }

  Device.init(
    {
      device_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-increment the device ID
      },
      device_type: {
        type: DataTypes.ENUM('wearable', 'camera'),
        allowNull: false, // Must be either 'wearable' or 'camera'
      },
      status: {
        type: DataTypes.ENUM('connected', 'disconnected'),
        allowNull: false, // Must be either 'connected' or 'disconnected'
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key linking the device to the patient
        references: {
          model: 'patients', // References the Patient model
          key: 'patient_id', // References the primary key of the patients table
        },
        onDelete: 'CASCADE', // If the patient is deleted, delete the associated devices
      },
      last_sync_time: {
        type: DataTypes.DATE,
        allowNull: true, // Time when the device was last synced, can be null
      },
    },
    {
      sequelize,
      modelName: 'Device',
      tableName: 'devices', // Name of the table storing device information
    }
  );

  return Device;
};
