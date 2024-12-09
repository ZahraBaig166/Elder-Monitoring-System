'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('query', {
      query_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      raised_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'caregiver', // Reference the caregivers table
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      raised_to: {
        type: Sequelize.INTEGER,
        references: {
          model: 'family', // Reference the families table
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      is_resolved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('query');
  },
};
