export const checkFall = async (metrics) => {
  try {
    const response = await fetch("http://192.168.100.70:8001/fall/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
    });

    const result = await response.json();
    return result; // { prediction: "Fall Detected", raw_output: 1 }
  } catch (error) {
    console.error("Error calling Fall Detection API:", error);
    return { prediction: "Error", raw_output: null };
  }
};