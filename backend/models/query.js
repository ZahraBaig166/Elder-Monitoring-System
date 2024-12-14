'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    static associate(models) {
      // Polymorphic relationship: sender_id can reference either Caregiver or Family
      Query.belongsTo(models.Caregiver, {
        foreignKey: 'sender_id',
        as: 'caregiver',
        constraints: false,
        scope: {
          sender_type: 'caregiver',
        },
      });

      Query.belongsTo(models.Family, {
        foreignKey: 'sender_id',
        as: 'family',
        constraints: false,
        scope: {
          sender_type: 'family',
        },
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
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recepient:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sender_type: {
        type: DataTypes.STRING,
        allowNull: false,
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
      timestamps: false,
    }
  );

  return Query;
};
