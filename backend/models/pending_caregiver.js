'use strict';
const { DataTypes } = require('sequelize');
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PendingCaregiver = sequelize.define("PendingCaregiver", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  // Ensure email is unique
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education: {
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
  });

  return PendingCaregiver;
};
