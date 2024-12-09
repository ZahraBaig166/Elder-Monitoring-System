'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};



// Initialize Sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Test Sequelize connection
// sequelize.authenticate()
//   .then(() => console.log('Database connected successfully!'))
//   .catch(err => console.error('Error connecting to the database:', err));

// // Import models dynamically
// fs
//   .readdirSync(__dirname)
//   .filter(file => file.indexOf('.') !== 0 && file !== basename && file.endsWith('.js') && !file.endsWith('.test.js'))
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });
//   console.log('Models loaded:', Object.keys(db));



const Caregiver = require('./caregiver')(sequelize, Sequelize.DataTypes);
const Patient = require('./patient')(sequelize, Sequelize.DataTypes); // Parent model
const Family = require('./family')(sequelize, Sequelize.DataTypes);
const Alerts = require('./alerts')(sequelize, Sequelize.DataTypes);  // Depends on Patient
const Query = require('./query')(sequelize, Sequelize.DataTypes);
const HealthMetric = require('./health_metrics')(sequelize, Sequelize.DataTypes);
const MedicationSchedule = require('./medication_schedule')(sequelize, Sequelize.DataTypes);
const Device = require('./device')(sequelize, Sequelize.DataTypes);
const PendingCaregiver = require('./pending_caregiver')(sequelize, Sequelize.DataTypes);
const PendingFamily = require('./pending_family')(sequelize, Sequelize.DataTypes);
const LocationHistory = require('./location_history')(sequelize, Sequelize.DataTypes);

db.Caregiver = Caregiver;
db.Patient = Patient;
db.Family = Family;
db.Alerts = Alerts;
// db.Query = Query;
db.HealthMetric = HealthMetric;
db.MedicationSchedule = MedicationSchedule;
db.Device = Device;
db.PendingCaregiver = PendingCaregiver;
db.PendingFamily = PendingFamily;
db.LocationHistory = LocationHistory;
db.Query=Query;



// Initialize associations before syncing
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Passes all models so associations can be established
  }
});
console.log('Models loaded:', Object.keys(db));
// Export db with Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
