// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // For MySQL
//     await queryInterface.changeColumn('patient', 'patient_id', {
//       type: Sequelize.BIGINT, // or Sequelize.INTEGER
//       primaryKey: true,
//     });
//   },
//   down: async (queryInterface, Sequelize) => {
//     // If you want to revert to the original state, add autoIncrement back
//     await queryInterface.changeColumn('patient', 'patient_id', {
//       type: Sequelize.BIGINT, // or Sequelize.INTEGER
//       primaryKey: true,
//       autoIncrement: true,
//     });
//   },
// };
