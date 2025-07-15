export const checkAnomaly = async (metrics) => {
     console.log("Calling Anomaly Detection Model with metrics:", metrics);
  try {
    const response = await fetch(`http://10.46.42.129:8001/anomaly/anomaly-detection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
    });

    const result = await response.json();
    return result; 
  } catch (error) {
  }
};

export const getPatientRoutine = async (patientId) => {
  try {
    const response = await fetch(`http://10.46.42.129:8001/anomaly/patient-routine/${patientId}`);
    console.log(response.json);
    return await response.json();
  } catch (error) {
    console.error("Error fetching patient routine:", error);
    return { routine: [], error: error.message };
  }
};

export const getSleepPattern = async (patientId) => {
  try {
    const response = await fetch(`http://10.46.42.129:8001/anomaly/patient-sleep-pattern/${patientId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching sleep pattern:", error);
    return { sleep_pattern: [], error: error.message };
  }
};