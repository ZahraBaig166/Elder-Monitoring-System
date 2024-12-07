'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    static associate(models) {
      // Query is raised by either a Caregiver or FamilyMember
      // It has a foreign key that links to either Caregiver or FamilyMember

      Query.belongsTo(models.Caregiver, {
        foreignKey: 'raised_by',
        as: 'caregiver', // Alias for the caregiver association
        constraints: false, // This will allow a polymorphic relationship
      });

      Query.belongsTo(models.FamilyMember, {
        foreignKey: 'raised_by',
        as: 'familyMember', // Alias for the family member association
        constraints: false, // This will allow a polymorphic relationship
      });
    }
  }

  Query.init(
    {
      query_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments the query_id
      },
      raised_by: {
        type: DataTypes.INTEGER,
        allowNull: false, // ID of the person raising the query (caregiver or family member)
        references: {
          model: 'caregivers', // Foreign key referencing caregivers table
          key: 'id',
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false, // Message field that stores the query details
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default timestamp as the current date and time
      },
      is_resolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Whether the query is resolved or not
      },
    },
    {
      sequelize,
      modelName: 'Query',
      tableName: 'queries', // Name of the table to store queries
    }
  );

  return Query;
};
