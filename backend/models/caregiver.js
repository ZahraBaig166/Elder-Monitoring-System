'use strict';
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Caregiver extends Model {
    static associate(models) {
      // A caregiver can have many queries raised by them
      Caregiver.hasMany(models.Query, {
        foreignKey: 'raised_by',
        as: 'queries', // Alias to fetch queries raised by the caregiver
      });

      // A caregiver can be assigned to many patients
      Caregiver.hasMany(models.Patient, {
        foreignKey: 'assigned_caregiver_id',
        as: 'patients', // Alias for the patients associated with a caregiver
      });
    }

    // Method to check if the password matches
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  Caregiver.init(
    {
      caregiver_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Set caregiver_id as the primary key
        autoIncrement: true, // Auto-increment the caregiver ID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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
      date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Caregiver",
      tableName: "caregivers", // Name of the table
      hooks: {
        beforeCreate: async (caregiver) => {
          const salt = await bcrypt.genSalt(10);
          caregiver.password = await bcrypt.hash(caregiver.password, salt); // Hash the password before saving it
        },

        // Hash the password before updating the user if password has changed
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return Caregiver;
};
