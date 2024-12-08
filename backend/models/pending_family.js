'use strict';
const { DataTypes } = require('sequelize');

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PendingFamily = sequelize.define("PendingFamily", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Ensure email is unique
    },
    relationship_to_patient: {
      type: DataTypes.STRING,
      allowNull: false, // E.g., mother, father, spouse, etc.
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Pending approval by default
    },
    date_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    // New patient-related fields
    patient_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patient_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patient_medical_conditions: {
      type: DataTypes.STRING,
      allowNull: true, // Could be empty if there are no medical conditions
    },
    patient_status: {
      type: DataTypes.ENUM('stable', 'critical', 'moderate'),
      allowNull: false,
    },
    patient_emergency_contact: {
      type: DataTypes.STRING,
      allowNull: false, // Emergency contact information
    },
  });

  return PendingFamily;
};
