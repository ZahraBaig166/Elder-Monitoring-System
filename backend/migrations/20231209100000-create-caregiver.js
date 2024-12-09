'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caregiver', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      education: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('caregiver');
  },
};
