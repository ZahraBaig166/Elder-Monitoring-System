'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename raised_by to sender_id
    await queryInterface.renameColumn('query', 'raised_by', 'sender_id');

    // Remove raised_to column
    await queryInterface.removeColumn('query', 'raised_to');

    // Add sender_type column
    await queryInterface.addColumn('query', 'sender_type', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add the phone_number field
    await queryInterface.addColumn('query', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Add the subject field
    await queryInterface.addColumn('query', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Modify timestamp
    await queryInterface.changeColumn('query', 'timestamp', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Make is_resolved default to false
    await queryInterface.changeColumn('query', 'is_resolved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    // Remove foreign key constraint on raised_by
    await queryInterface.removeConstraint('query', 'query_raised_by_fkey');
  },
};