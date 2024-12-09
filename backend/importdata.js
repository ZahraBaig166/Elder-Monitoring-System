const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { HealthMetric } = require('./models');  // Import the HealthMetric model
const { time, timeStamp } = require('console');

const csvFilePath = path.join(__dirname, 'merged_activity_heart_rate.csv'); 
console.log('HealthMetric Model:', HealthMetric);

// Function to import CSV into database
const importData = async () => {
  const results = [];

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data)) // Push CSV row data to results
    .on('end', async () => {
      try {
        for (const row of results) {
          // Insert data into the HealthMetric table
          await HealthMetric.create({
            patient_id: row.patient_id,
            time: row.time, 
            heart_rate: row.heart_rate,
            intensity: row.intensity,
            calories: row.calories,
            steps: row.steps,
            distance: row.distance,    
          });
        }
        console.log("Data import complete!");
      } catch (error) {
        console.error("Error importing data:", error);
      }
    });
};

// Call the import function
importData();
