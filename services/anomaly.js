export const checkAnomaly = async (metrics) => {
     console.log("Calling Anomaly Detection Model with metrics:", metrics);
  try {
    const response = await fetch(`http://192.168.100.70:8001/anomaly/anomaly-detection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
    });

    const result = await response.json();
    return result; 
  } catch (error) {
    // console.error("Error calling Anomaly Detection Model:", error);
    // return { anomaly: "Error", raw_output: null };
  }
};
