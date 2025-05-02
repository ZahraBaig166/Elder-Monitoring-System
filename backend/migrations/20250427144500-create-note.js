'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('note', {
      note_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caregiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'caregiver', 
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      patient_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'patient', 
          key: 'patient_id',
        },
        onDelete: 'CASCADE',
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('note');
  },
};
