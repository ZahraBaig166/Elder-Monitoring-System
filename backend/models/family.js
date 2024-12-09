'use strict';
const { DataTypes } = require('sequelize');

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class FamilyMember extends Model {
    static associate(models) {
      // Define the association with the Patient model (assuming a 'patients' model exists)
      FamilyMember.belongsTo(models.Patient, {
        foreignKey: 'patient_id', // Foreign key linking to Patient model
        onDelete: 'CASCADE', // Delete family member if patient is deleted
      });
      FamilyMember.hasMany(models.Query, {
        foreignKey: 'raised_by',
        as: 'queries', // Alias to fetch queries raised by the family member
      });
      
    }

    // Method to check if the password matches
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  FamilyMember.init(
    {
      family_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increment the ID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensure email is unique
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Enforce that the patient ID must be provided
        references: {
          model: 'patient', // Referencing the patients table
          key: 'id',         // Assuming 'id' is the primary key of the patients table
        },
        onDelete: 'CASCADE', // Optionally, delete family member if the related patient is deleted
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      relationship: {
        type: DataTypes.STRING,
        allowNull: false, // Relationship to the patient (e.g., son, daughter, etc.)
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
      modelName: 'family',
      tableName: 'family', // Name of the table
      hooks: {
        beforeCreate: async (familyMember) => {
          const salt = await bcrypt.genSalt(10);
          familyMember.password = await bcrypt.hash(familyMember.password, salt); // Hash the password before saving it
        },
        // Hash the password before updating the user if password has changed
        beforeUpdate: async (familyMember) => {
          if (familyMember.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            familyMember.password = await bcrypt.hash(familyMember.password, salt);
          }
        },
      },
    }
  );

  return FamilyMember;
};


