'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pending_caregiver', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      },
      address: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
  
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pending_caregiver');
  },
};
