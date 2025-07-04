'use strict';
const { DataTypes } = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class FamilyMember extends Model {
    static associate(models) {
      // Define the association with the Patient model (assuming a 'patients' model exists)
      FamilyMember.belongsTo(models.Patient, {
        foreignKey: 'patient_id', 
        onDelete: 'CASCADE', 
      });
      FamilyMember.hasMany(models.Query, {
        foreignKey: 'raised_by',
        as: 'queries',
      });
    }

    // Method to check if the password matches
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  FamilyMember.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
          key: 'patient_id',         // Assuming 'id' is the primary key of the patients table
        },
        onDelete: 'CASCADE', // Optionally, delete family member if the related patient is deleted
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
    },
    {
      sequelize,
      modelName: 'family',
      tableName: 'family', // Name of the table
      timestamps: false,  // This enables automatic management of createdAt and updatedAt
      // underscored: true,  // Use snake_case for the database fields
      hooks: {
        beforeCreate: async (familyMember) => {
          const salt = await bcrypt.genSalt(10);
          // familyMember.password = await bcrypt.hash(familyMember.password, salt); // Hash the password before saving it
        },
        // Hash the password before updating the user if password has changed
        beforeUpdate: async (familyMember) => {
          if (familyMember.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            // familyMember.password = await bcrypt.hash(familyMember.password, salt);
          }
        },
      },
    }
  );

  return FamilyMember;
};