'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LocationHistory extends Model {
    static associate(models) {
      // Each location history is associated with one patient
      LocationHistory.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
        as: 'patient', // Alias for the patient associated with this location history
      });
    }
  }

  LocationHistory.init(
    {
      location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto-increment the location ID
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Foreign key to the Patient table
        references: {
          model: 'patients', // The model that the foreign key references (patients table)
          key: 'patient_id', // Reference the primary key in the patients table
        },
        onDelete: 'CASCADE', // If the patient is deleted, delete associated location histories
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false, // Latitude of the location
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false, // Longitude of the location
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set the timestamp to current time by default
        allowNull: false, // Timestamp is required
      },
    },
    {
      sequelize,
      modelName: 'LocationHistory',
      tableName: 'location_histories', // Name of the table for storing location history
    }
  );

  return LocationHistory;
};
