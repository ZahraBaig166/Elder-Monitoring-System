'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      // Each alert is associated with a specific patient
      Alert.belongsTo(models.Patient, {
        foreignKey: 'patient_id', // Foreign key to reference the patient
        as: 'patient', // Alias for the associated patient
      });
    }
  }

  Alert.init(
    {
      alert_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set alert_id as the primary key
        autoIncrement: true, // Auto-increment the alert ID
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // The patient this alert is for
        references: {
          model: 'Patients', // Reference to the Patients table
          key: 'patient_id', // Foreign key to the patient_id
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false, // Type of alert (e.g., "Emergency", "Critical", etc.)
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Automatically set the current date/time when the alert is created
      },
      is_acknowledged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Initially, the alert is not acknowledged
      },
    },
    {
      sequelize,
      modelName: 'Alert',
      tableName: 'alerts', // Name of the table
    }
  );

  return Alert;
};
