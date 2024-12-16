'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('query', 'response', {
      type: Sequelize.TEXT,
      allowNull: true,  // Allow null as response might not be provided immediately
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('query', 'response');
  }
};
