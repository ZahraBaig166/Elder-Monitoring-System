const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { HealthMetric } = require('./models');  // Import the HealthMetric model

const csvFilePath = path.join(__dirname, 'metrics_data.csv'); // Path to your CSV file
console.log('HealthMetric Model:', HealthMetric);

// Function to import CSV into the database
const importData = async () => {
  const results = [];

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv({ skipEmptyLines: true }))
    .on('data', (data) => {
      const patientId = parseInt(data.patient_id, 10);
      if (isNaN(patientId)) {
        console.error(`Invalid patient_id: ${data.patient_id}`);
        return; // Skip invalid rows
      }
      results.push(data);
    })
    .on('end', async () => {
      try {
        // Process the valid rows and insert them into the HealthMetrics table
        for (const row of results) {
          // Handle datetime and other column transformations
          const parsedTime = new Date(row.Time); // Adjust as needed based on your time format

          await HealthMetric.create({
            patient_id: row.patient_id,
            time: parsedTime,
            value: row.Value,
            intensity: row.Intensity,
            calories: row.Calories,
            steps: row.Steps,
            distance: row.Distance,
            sleep_stage: row.Sleep_Stage,
            accel_x_list: row.accel_x_list,
            accel_y_list: row.accel_y_list,
            accel_z_list: row.accel_z_list,
            gyro_x_list: row.gyro_x_list,
            gyro_y_list: row.gyro_y_list,
            gyro_z_list: row.gyro_z_list,
            orientation_s_list: row.orientation_s_list,
            orientation_i_list: row.orientation_i_list,
            orientation_j_list: row.orientation_j_list,
            orientation_k_list: row.orientation_k_list,
            fall: row.FALL,  
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