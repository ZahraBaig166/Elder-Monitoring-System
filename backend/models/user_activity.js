'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserActivity extends Model {
    static associate(models) {
      // Association with Caregiver (optional: use constraints as needed)
      UserActivity.belongsTo(models.Caregiver, {
        foreignKey: 'caregiver_id',
        as: 'caregiver',
      });

      // Association with Family
      UserActivity.belongsTo(models.Family, {
        foreignKey: 'family_id',
        as: 'family',
      });
    }
  }

  UserActivity.init(
    {
      activity_id: {
       type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_type: {
        type: DataTypes.STRING,
        allowNull: false, // 'caregiver' or 'family'
      },
      caregiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      family_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      activity_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
 
    },
    {
      sequelize,
      modelName: 'UserActivity',
      tableName: 'user_activity',
      timestamps: false,
    }
  );

  return UserActivity;
};
