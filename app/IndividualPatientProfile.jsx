import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import NavBar from '../components/NavBar';
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkFall } from "../services/fallApi";
import useAuth from "../hooks/useAuth";
import { useLocalSearchParams } from "expo-router"; // NEW


const IndividualPatientProfile = () => {
    const { patientId: routePatientId } = useLocalSearchParams();
    const { patientId } = useLocalSearchParams();
  const [patientName, setPatientName] = useState("");
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [currentHeartRate, setCurrentHeartRate] = useState("Loading...");
  const [currentRowIndex, setCurrentRowIndex] = useState(0); 
  const [hrvIndex, setHrvIndex] = useState(0);
  const [stressData, setStressData] = useState({ stress: "Calculating...", color: "#000" });
  const [fallStatus, setFallStatus] = useState("Unknown");
  const [notes, setNotes] = useState([]); 
const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 
  const { apiBaseUrl, loading, error } = useConfig();  
   const { user, loading: authLoading } = useAuth();


  useEffect(() => {
    const fetchPatientDataAndMetrics = async () => {
      if (!patientId) return;
  
      try {
        // Step 1: Fetch Patient Details
        const patientResponse = await fetch(`${apiBaseUrl}/patientclicked/${patientId}`);
        const patientData = await patientResponse.json();
  
        if (patientResponse.ok) {
          setPatientName(patientData.name);
        } else {
          console.error("Failed to fetch patient name:", patientData.message);
        }
  
        // Step 2: Fetch Health Metrics
        const metricsResponse = await fetch(`${apiBaseUrl}/health-metrics/${patientId}`);
        const metricsData = await metricsResponse.json();
  
        if (metricsResponse.ok) {
          setHealthMetrics(metricsData);
          if (metricsData.length > 0) {
            setCurrentHeartRate(metricsData[0].value);
          }
        } else {
          console.error("Failed to fetch health metrics:", metricsData.message);
        }
  
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
  
    if (!loading && patientId) {
      fetchPatientDataAndMetrics();
    }
  }, [apiBaseUrl, loading, patientId]);
  
  useEffect(() => {
    const fetchNotes = async () => {
      console.log("Fetching notes for patientId:", patientId);
      try {
        const response = await fetch(`${apiBaseUrl}/notes/${patientId}`);
        console.log("Response status:", response.status);  // Log response status
  
        // Check if the response is OK (status code 200)
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        // Log the body of the response before parsing it
        const result = await response.json();
        console.log("Notes response:", result);  // Log the result after parsing
  
        
          setNotes(result.data);  // Update state with fetched notes
       
      } 
      
      catch (error) {
        // console.error('Error fetching notes:', error);
      }
      finally {
        setIsLoading(false);  
      }
    };
  
    fetchNotes();
  }, [apiBaseUrl,patientId,loading]);
  
  

  useEffect(() => {
    if (healthMetrics.length > 0) {
      const interval = setInterval(() => {
        setCurrentRowIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % healthMetrics.length;
  
          // Update the heart rate
          const heartRate = healthMetrics[nextIndex].value;
          setCurrentHeartRate(heartRate);
  
          // Ensure we always get the last 5 values, even if index < 5
          let start = Math.max(0, nextIndex - 4);
          let end = nextIndex + 1;
  
          const lastFiveHeartRates = healthMetrics
            .slice(start, end) // Get up to 5 values
            .map((item) => item.value);
  
          // If fewer than 5 values exist, pad with the first available value
          while (lastFiveHeartRates.length < 5) {
            lastFiveHeartRates.unshift(healthMetrics[0].value);
          }
  
          // Calculate HRV and Stress Level
          const { hrv, stress, color } = stressLevel(lastFiveHeartRates);
  
          // Update state with HRV and Stress Level
          setHrvIndex(hrv);
          setStressData({ stress, color });
  
          // Prepare data for Fall Detection API
          const currentMetrics = healthMetrics[nextIndex];
          const fallDetectionPayload = {
            accel_x_list: currentMetrics.accel_x_list,
            accel_y_list: currentMetrics.accel_y_list,
            accel_z_list: currentMetrics.accel_z_list,
            gyro_x_list: currentMetrics.gyro_x_list,
            gyro_y_list: currentMetrics.gyro_y_list,
            gyro_z_list: currentMetrics.gyro_z_list,
            orientation_s_list: currentMetrics.orientation_s_list,
            orientation_i_list: currentMetrics.orientation_i_list,
            orientation_j_list: currentMetrics.orientation_j_list,
            orientation_k_list: currentMetrics.orientation_k_list,
          };
         
          
          // Call FastAPI Fall Detection Endpoint
          checkFall(fallDetectionPayload)
          .then((res) => {
            setFallStatus(res.prediction); 
          console.log(currentMetrics.id)  
          console.log(fallDetectionPayload)
          console.log(res)
            // Show alert if fall is detected
            if (res.prediction === "Fall Detected") {
                 createAlert(patientId,"Fall Detected")
              // Create an alert in the database
            }
          })
          .catch((err) => {
            console.error("Error checking fall detection:", err);
            setFallStatus("Error detecting fall");
          });
        
  
          return nextIndex;
        });
      }, 3000); // Interval of 3 seconds
  
      return () => clearInterval(interval);
    }
  }, [healthMetrics]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text> {}
      </View>
    );
  }
  const createAlert = async (patient_id, type) => {
    // const patientId = "2022484408"; // Replace with the patient ID
    // const type = "Fall Detected"; // Example alert type
  
    console.log("Initiating alert creation...");
  
    try {
      // Perform the fetch request
      const response = await fetch(`${apiBaseUrl}/alert/${patient_id}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Alert created successfully:", data);
        alert("Alert created successfully!");
      } else {
        console.error("Error creating alert:", data.message);
        alert(data.message || "Failed to create alert");
      }
    } catch (error) {
      console.error("Unexpected error creating alert:", error);
      alert("An unexpected error occurred while creating the alert");
    }
  };
  
  // Function to calculate HRV Triangular Index and return Stress Level
const stressLevel = (heartRateValues) => {
  if (!heartRateValues || heartRateValues.length === 0) {
    return { hrv: 0, stress: "No Data", color: "#000" };
  }

  // Step 1: Convert Heart Rate (bpm) to R-R intervals (ms)
  const rrIntervals = heartRateValues.map((hr) => Math.round(60000 / hr));

  // Step 2: Bin the R-R intervals into 50ms bins
  const binSize = 50;
  const bins = {};
  rrIntervals.forEach((rr) => {
    const bin = Math.floor(rr / binSize) * binSize;
    bins[bin] = (bins[bin] || 0) + 1;
  });

  // Step 3: Find the bin with the maximum frequency
  const maxBinCount = Math.max(...Object.values(bins));

  // Step 4: Calculate HRV Triangular Index
  const hrvIndex = rrIntervals.length / maxBinCount;

  // Step 5: Determine stress level based on HRV Index
  let stress;
  let color;

  if (hrvIndex > 20) {
    stress = "Deeply Relaxed";
    color = "#34C759"; // Green
  } else if (hrvIndex > 15) {
    stress = "Quietly Relaxed";
    color = "#85E6C4";
  } else if (hrvIndex > 10) {
    stress = "Mildly Calm";
    color = "#FFD60A"; // Yellow
  } else if (hrvIndex > 5) {
    stress = "Slightly Tense";
    color = "#FF9F0A"; // Orange
  } else {
    stress = "Highly Tense";
    color = "#FF3B30"; // Red
  }

  return { hrv: hrvIndex.toFixed(2), stress, color };
};

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}></Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.queriesButton} onPress={() => router.push('/AddNotes')}> 
        <Text style={styles.queriesButtonText}>Add Notes</Text> 
      </TouchableOpacity>

     {/* <TouchableOpacity style={styles.notesButton} onPress={() => router.push('/ViewNotes')}> 
             <Text style={styles.notesButtonText}>View Notes</Text> 
           </TouchableOpacity> */}

      <ScrollView style={styles.scrollView}>
        <Text style={styles.patientName}>Patient name: {patientName}</Text>

        {/* Heart Rate Section */}
        <View style={styles.heartRateContainer}>
          <View style={styles.heartRateSection}>
            {/* Image 1 */}
            <Image
              source={require("@/assets/images/hearticon.png")}
              style={styles.heartIcon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.heartRateText}>{currentHeartRate} bpm</Text>
              <Text style={styles.heartRateLabel}>Heart Rate</Text>
            </View>
          </View>

          {/* Image 2 */}
          <Image
            source={require("@/assets/images/Heartrate.png")}
            style={styles.heartRateGraph}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.row}>
            {/* Blood Count */}
            <View style={styles.statCardblood}>
              <View style={styles.iconContainer}>
                <Image
                  source={require("@/assets/images/bloodicon.png")}
                  style={styles.iconblood}
                />
              </View>
              <Text style={styles.statTitle}>Sleep STAGE</Text>
              <Text style={styles.statValue}>AWAKE</Text>
              <Image
                source={require("@/assets/images/bloodgraph.png")}
                style={styles.graphblood}
              />
            </View>

            {/* Pills */}
            <TouchableOpacity
              style={styles.statCard}
               // Navigate to Medication page
            >
              <Image
                source={require("@/assets/images/pills.png")}
                style={styles.iconpill}
              />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statTitle}>Pills</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {/* Stress Level */}
            <View style={styles.statCardstress}>
              <Text style={[styles.statTitle, styles.pinkTitle]}>
                Stress Level
              </Text>
              <Image
                source={require("@/assets/images/stressgraph.png")}
                style={styles.graph}
              />
              <Text style={styles.statValue}>{stressData.stress}</Text>
              <Text style={styles.subValue}>
              <Text style={{ color: stressData.color }}>▼ {hrvIndex}</Text>
              </Text>
            </View>

            {/* Mood Analysis */}
            <View style={styles.statCardmood}>
              <Text style={[styles.statTitle, styles.greenTitle]}>
                Mood Analysis
              </Text>
              <Image
                source={require("@/assets/images/moodgraph.png")}
                style={styles.graph}
              />
              <Text style={styles.statValue}>225</Text>
              <Text style={styles.subValue}>
                <Text style={styles.greenText}>▲5%</Text> mg/dL
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 15 , marginHorizontal: 15}}>
        {isLoading ? (
  <Text>Loading notes...</Text>
) : (!notes || notes.length === 0 ? (
  <Text>No notes available for this patient.</Text>
) : (
  notes.map((note, index) => (
    <View
      key={index}
      style={{
        backgroundColor: '#D9E3EF', // light blue
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ fontWeight: '700',fontSize:'20' , marginBottom: 5 }}>Notes</Text>
      <Text style={{ color: '#1E3A8A', fontWeight: '600', fontSize: 16 }}>
        Note: {note.note || "No note available"}
      </Text>
      <Text style={{ fontSize: 13, color: 'gray', marginTop: 5 }}>
        {note.timestamp ? new Date(note.timestamp).toLocaleString() : "No timestamp available"}
      </Text>
    </View>
  ))
))}

</View>




        {/* Sleep Pattern Graph */}
        <View style={styles.sleepPatternContainer}>
          <Text style={styles.sleepPatternTitle}>Sleep Pattern</Text>
          <LineChart
            data={{
              labels: ["9", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"],
              datasets: [
                {
                  data: [1, 2, 1.5, 3, 2.5, 4, 2, 3, 4.5, 3, 2],
                  color: (opacity = 1) => `rgba(50, 115, 220, ${opacity})`,
                  strokeWidth: 3,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: "#ADC1D8",
              backgroundGradientTo: "#ADC1D8",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ffffff",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 15,
            }}
          />
        </View>

        <View style={styles.activityLevelContainer}>
          <View style={styles.activityLevelHeader}>
            <Text style={styles.activityLevelTitle}>Activity Level</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>This Week</Text>
            </TouchableOpacity>
          </View>

          <BarChart
            data={{
              labels: ["16", "17", "18", "19", "20", "21", "22"],
              datasets: [{ data: [3000, 6000, 4500, 7200, 5289, 6400, 5800] }],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            fromZero
            chartConfig={{
              backgroundGradientFrom: "#ADC1D8",
              backgroundGradientTo: "#ADC1D8",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chartStyle}
          />
          {/* Additional Stats Below the Bar Chart */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statsTab}>
              <Text style={styles.statsTabText}>Steps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.statsTab, styles.inactiveTab]}>
              <Text style={[styles.statsTabText, styles.inactiveTabText]}>Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statsTab, styles.inactiveTab]}>
              <Text style={[styles.statsTabText, styles.inactiveTabText]}>Calorie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statsTab, styles.inactiveTab]}>
              <Text style={[styles.statsTabText, styles.inactiveTabText]}>Distance</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalStats}>
            <Text style={styles.totalSteps}>256,480</Text>
            <Text style={styles.totalLabel}>Total steps all the time</Text>
          </View>

          <View style={styles.detailedStats}>
            <View style={styles.statDetail}>
              <Image
                source={{
                  uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} 
                style={styles.iconImage}
              />
              <Text style={styles.statDetailValue}>85h 24m</Text>
              <Text style={styles.statDetailLabel}>Time</Text>
            </View>
            <View style={styles.statDetail}>
              <Image
                source={{
                  uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} 
                style={styles.iconImage}
              />
              <Text style={styles.statDetailValue}>20,492</Text>
              <Text style={styles.statDetailLabel}>Kcal</Text>
            </View>
            <View style={styles.statDetail}>
              <Image
                source={{
                  uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} 
                style={styles.iconImage}
              />
              <Text style={styles.statDetailValue}>294.35</Text>
              <Text style={styles.statDetailLabel}>km</Text>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ADC1D8",
    paddingHorizontal: 20,
    paddingTop: 50, // For spacing at the top
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  queriesButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    position: "absolute",
    right: 20, // Adjust to position the button to the top right
    top: 50,   // Adjust to match header spacing
  },
  queriesButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  notesButton: {
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    position: "absolute",
     right: 140, // Adjust to position the button to the top right
    top: 50,   // Adjust to match header spacing
  },
  notesButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  backButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  backIcon: {
    fontSize: 18,
    color: "#000",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWithLabel: {
    alignItems: "center",
    marginLeft: 15,
  },
  headerIcon: {
    fontSize: 20,
    color: "#000",
  },
  headerLabel: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  patientName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    marginTop: 10,
    marginLeft: 20,
  },
  scrollView: { flex: 1, backgroundColor: "#ADC1D8" },
  scrollContent: { padding: 20 },
  heartRateContainer: {
    backgroundColor: "#ADC1D8",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  heartRateSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  heartIcon: {
    width: 77,
    height: 77,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
   heartRateContainer: {
    backgroundColor: "#ADC1D8", // Match the background color
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  heartRateSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  heartIcon: {
    width: 77, // Width from the design
    height: 77, // Height from the design
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  heartRateText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heartRateLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 5,
  },
  heartRateGraph: {
    width: "100%", // Full width of the parent
    height: 83, // Height from the design
    resizeMode: "contain",
    borderRadius: 15, // Rounded corners like the design
  },
  statsContainer: {
    padding: 10,
    backgroundColor: "#ADC1D8",
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
  },
 statCardblood:{
  // flex: 1,
  width: 220,
  height: 180,
  backgroundColor: "#EFEFEF",
  borderRadius: 15,
   alignItems: "center",
  padding: 10,
  marginHorizontal: 5,
 },
 statCardstress:{
  backgroundColor: "#FCF2F5",
    borderRadius: 15,
    alignItems: "center",
    width: 180,
    padding: 10,
    marginHorizontal: 5,
 },
 statCardmood:{
  backgroundColor: "#F8FEEB",
flex: 1,
  borderRadius: 15,
  alignItems: "center",
  padding: 10,
  marginHorizontal: 5,
 },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
     alignItems: "center",
    marginBottom: 5,
    marginLeft: -100,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  iconpill: {
    width: 65,
    height: 100,
    resizeMode: "contain",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "#7E8C99",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#646667",
  },
  graph: {
    width: "80%",
    height: 40,
    resizeMode: "contain",
    marginTop: 10,
  },
  graphblood: {
    width: 180,
    height: 60,
    marginLeft: 10,
  },
  pinkTitle: {
    color: "#FF6B6B",
  },
  greenTitle: {
    color: "#34C759",
  },
  pinkText: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
  greenText: {
    color: "#34C759",
    fontWeight: "700",
  },
  subValue: {
    fontSize: 12,
    color: "#7E8C99",
    marginTop: 5,
  },
  sleepPatternContainer: {
    backgroundColor: "#ADC1D8",
    borderRadius: 15,
    paddingleft: 20,
    marginBottom: 20,
  },
  sleepPatternTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  scrollView: { flex: 1, backgroundColor: "#ADC1D8" },
  scrollContent: { padding: 20 },
  activityLevelContainer: {
    backgroundColor: "#ADC1D8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  activityLevelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,

  },
  activityLevelTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  dropdown: { padding: 5, borderRadius: 10, backgroundColor: "#FFFFFF" },
  dropdownText: { fontSize: 12, color: "#406B9E" },
  chartStyle: {borderRadius: 15,
     marginVertical: 10,
    //  marginLeft: -20,
    
     },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statsTab: {
    backgroundColor: "#406B9E",
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 20,
  },
  statsTabText: { color: "#FFFFFF", fontSize: 14 },
  inactiveTab: { backgroundColor: "#FFFFFF" },
  inactiveTabText: { color: "#000" },
  totalStats: { alignItems: "center", marginVertical: 20 },
  totalSteps: { fontSize: 36, fontWeight: "700", color: "#406B9E" },
  totalLabel: { fontSize: 14, color: "#7E8C99" },
  detailedStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  statDetail: { alignItems: "center" },
  statDetailValue: { fontSize: 18, fontWeight: "700", color: "#406B9E" },
  statDetailLabel: { fontSize: 12, color: "#7E8C99" },
  ChartStyles: {
    backgroundColor: '#f7f9fb',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
 
});

export default IndividualPatientProfile;