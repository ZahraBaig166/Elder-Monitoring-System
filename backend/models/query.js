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

      Query.belongsTo(models.Family, {
        foreignKey: 'raised_by',
        as: 'family', // Alias for the family member association
        constraints: false, // This will allow a polymorphic relationship
      });
    }
  }
  Query.init(
    {
      query_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      raised_by: DataTypes.INTEGER,
      raised_to: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_resolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'query',
      tableName: 'query',
    }
  );
  return Query;
};
