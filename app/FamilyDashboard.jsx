import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkFall } from "../services/fallApi";
import useAuth from "../hooks/useAuth";
import NavBarFamily from '../components/NavBarFamily';
import Svg, { Line, Rect, Text as SvgText , Circle } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { checkAnomaly, getPatientRoutine,getSleepPattern } from "../services/anomaly"; 



const DashboardHeartRateAndStats = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [currentHeartRate, setCurrentHeartRate] = useState("Loading...");
  const [currentRowIndex, setCurrentRowIndex] = useState(0); 
  const [hrvIndex, setHrvIndex] = useState(0);
  const [stressData, setStressData] = useState({ stress: "Calculating...", color: "#000" });
  const [fallStatus, setFallStatus] = useState("Unknown");
  const device_connect =1;
  const [routine, setRoutine] = useState(0);
  const [sleepPattern, setSleepPattern] = useState([]);
  const [sleepLoading, setSleepLoading] = useState(false);

  const router = useRouter(); 
  const { apiBaseUrl, loading, error } = useConfig();  
   const { user, loading: authLoading } = useAuth();
  
  const handlemed = () => {
    router.push("/MedicationReminder"); 
  };

  useEffect(() => {
  const fetchPatientDataAndMetrics = async () => {
    try {
      // ✅ Mimic device connectivity
      if (device_connect === 0) {
        console.error("⚠ Device Disconnected");
        alert("⚠ Device disconnected! No real-time data.");
        return; // Stop further processing
      }

      // Fetch family patient(s)
      console.log("Fetching family data...", user.userId);
      const userId = user.userId;
      const familyResponse = await fetch(`${apiBaseUrl}/family/${userId}`);
      const data = await familyResponse.json();
      console.log("Family Data:", data);

      if (!familyResponse.ok || !Array.isArray(data) || data.length === 0) {
        console.error("No patients found in Family table");
        return;
      }

      const id = data[0].patient_id;
      setPatientId(id);

      // Fetch Patient Details
      const patientResponse = await fetch(`${apiBaseUrl}/patient/${id}`);
      const patientData = await patientResponse.json();

      if (patientResponse.ok) {
        setPatientName(patientData.name);
      } else {
        console.error("Failed to fetch patient name:", patientData.message);
      }

      // Fetch Health Metrics
      const metricsResponse = await fetch(`${apiBaseUrl}/health-metrics/${id}`);
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
      console.error("Error fetching data:", error);
    }
  };

  if (!loading) {
    fetchPatientDataAndMetrics();
  }
}, [apiBaseUrl, loading]);
  

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
          console.log(res.prediction)
            // Show alert if fall is detected
            if (res.prediction === "Fall Detected") {
                 createAlert(patientId,"Fall Detected")
              // Create an alert in the database
            }
          })
          .catch((err) => {
            // console.error("Error checking fall detection:", err);
            // setFallStatus("Error detecting fall");
          });

          const newcurrentmetrics = {
                patient_id: parseInt(currentMetrics.patient_id),
                value: parseFloat(currentMetrics.value),
                steps: parseInt(currentMetrics.steps),
                calories: parseFloat(currentMetrics.calories),
                distance: parseFloat(currentMetrics.distance),
                sleep_stage: parseInt(currentMetrics.sleep_stage),
              };

          checkAnomaly(newcurrentmetrics).then((result) => {
            
      console.log("ANOMALY DETECTION MODEL RUNNING ", result);
});
        
  
          return nextIndex;
        });
      }, 3000); // Interval of 3 seconds
  
      return () => clearInterval(interval);
    }
  }, [healthMetrics]);


useEffect(() => {
  const fetchRoutine = async () => {
    console.log("Fetching Routine for Patient:", patientId);
    const result = await getPatientRoutine(patientId);
    // console.log("Routine API Response:", result);

    if (Array.isArray(result.routine) && result.routine.length > 0) {
      setRoutine(result.routine);
    } else {
      console.warn("No routine data or API returned an error:", result);
      setRoutine([]); 
    }
  };

  fetchRoutine();
}, [patientId]);


useEffect(() => {
  const fetchSleepPattern = async () => {
    if (!patientId) return;

    console.log("📡 Fetching sleep pattern for patient:", patientId);
    try {
      const result = await getSleepPattern(patientId);

      if (Array.isArray(result.sleep_pattern) && result.sleep_pattern.length > 0) {
        const cleanedData = result.sleep_pattern.filter(
          item => item.sleep_stage !== "No Data"
        );
        console.log("✅ Aggregated Sleep Pattern:", cleanedData);
        setSleepPattern(cleanedData);
      } else {
        console.warn("⚠ No sleep pattern data or API error:", result.error);
        setSleepPattern([]);
      }
    } catch (err) {
      console.error("❌ Error fetching sleep pattern:", err);
      setSleepPattern([]);
    }
  };

  fetchSleepPattern();
}, [patientId]);

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
  const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('type');
    console.log('Logged out');
    
    // ✅ Redirect to index.jsx (typically your login or welcome screen)
    router.replace('/'); // or router.push('/') depending on your routing structure
  } catch (e) {
    console.error('Logout failed:', e);
}
};

  
  // Function to calculate HRV Triangular Index and return Stress Level
const stressLevel = (heartRateValues) => {
  // console.log("Calculating HRV Triangular Index with values:", heartRateValues);

  if (!heartRateValues || heartRateValues.length < 3) {
    return { hrv: 0, stress: "No Data", color: "#000" };
  }

  // Step 1: Convert HR to RR intervals (ms)
  const rrIntervals = heartRateValues.map((hr) => Math.round(60000 / hr));

  // Step 2: Count frequency of each RR interval (binning by 50ms to smooth)
  const binSize = 50; // ms
  const histogram = {};
  rrIntervals.forEach((rr) => {
    const bin = Math.round(rr / binSize) * binSize;
    histogram[bin] = (histogram[bin] || 0) + 1;
  });

  // Step 3: Sum of NN intervals = total number of RR intervals
  const sumNN = rrIntervals.length;

  // Step 4: Max NN = most frequent bin count
  const maxBinCount = Math.max(...Object.values(histogram));

  // Step 5: HRV Triangular Index
  const hrvIndex = sumNN / maxBinCount;

  // Step 6: Stress Classification
  let stress, color;

  if (hrvIndex <= 15) {
    stress = "Highly Tense";
    color = "#FF3B30";
  } else if (hrvIndex <= 25) {
    stress = "Slightly Tense";
    color = "#FF9F0A";
  } else if (hrvIndex <= 52) {
    stress = "Mildly Calm";
    color = "#FFD60A";
  } else if (hrvIndex <= 60) {
    stress = "Quietly Relaxed";
    color = "#85E6C4";
  } else {
    stress = "Deeply Relaxed";
    color = "#34C759";
  }

  return {
    hrv: hrvIndex.toFixed(2),
    stress,
    color
  };
};


  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}></Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.queriesButton} onPress={() => router.push('/UserQueries')}> 
        <Text style={styles.queriesButtonText}>Queries</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.notesButton} onPress={() => router.push('/ViewNotes')}> 
        <Text style={styles.notesButtonText}>View Notes</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.reportsButton} onPress={() => router.push(`/Reports/${patientId}`)}> 
        <Text style={styles.reportsButtonText}>View Reports</Text> 
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.patientName}>Patient name: {patientName}</Text>
         <TouchableOpacity onPress={logout} style={styles.logoutButton}>
    <FontAwesome name="sign-out" size={34} color="#fff"  />
  </TouchableOpacity>

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
              onPress={handlemed}  // Navigate to Medication page
            >
              <Image
                source={require("@/assets/images/pills.png")}
                style={styles.iconpill}
              />
              <Text style={styles.statValue}>Medicine</Text>
              <Text style={styles.statTitle}>Schedule</Text>
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
        <FallIncidentBarChart></FallIncidentBarChart>
       <View style={styles.RoutineSection}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
    Patient Routine (Last 24 Hours)
  </Text>

  {Array.isArray(routine) && routine.length > 0 ? (
    <ScrollView horizontal>
      <View>
        {/* Table Header */}
        <View style={[styles.RoutineRow, styles.RoutineHeader]}>
          <Text style={styles.RoutineCell}>Time</Text>
          <Text style={styles.RoutineCell}>Activity</Text>
          <Text style={styles.RoutineCell}>Mood</Text>
          <Text style={styles.RoutineCell}>Heart Rate</Text>
        </View>

        {/* Table Rows */}
        {routine.map((item, index) => (
          <View key={index} style={styles.RoutineRow}>
            <Text style={styles.RoutineCell}>{item.time_interval}</Text>
            <Text style={styles.RoutineCell}>{item.activity}</Text>
            <Text style={styles.RoutineCell}>{item.emotion}</Text>
            <Text style={styles.RoutineCell}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  ) : (
    <Text style={{ fontSize: 14, color: "gray" }}>
      No routine data available.
    </Text>
  )}
</View>
{/* sleeppppppp */}
{/* Sleep Pattern Section */}
<View style={{ marginVertical: 20 }}>
  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
    Sleep Pattern (Last 24 Hours)
  </Text>

  {sleepLoading ? (
    <Text style={{ color: "gray", textAlign: "center" }}>Loading sleep pattern...</Text>
  ) : sleepPattern.length > 0 ? (
    (() => {
      const stageMap = { "Awake": 0, "Light Sleep": 1, "Deep Sleep": 2 };
      const reverseMap = { 
                0: "Awake", 
                1: "Light", 
                2: "Deep" 
              };

      const filteredData = sleepPattern.filter(item => item.sleep_stage !== "No Data");

      const labels = filteredData.map((item, index) =>
        index % 2 === 0 ? item.time : ""
      );
      const dataPoints = filteredData.map(item => stageMap[item.sleep_stage]);

      return (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: dataPoints }]
          }}
          width={Dimensions.get("window").width - 30}
          height={200}
          fromZero
          yAxisInterval={1}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Line color
            labelColor: () => "#333",
            propsForDots: {
              r: "3",
              strokeWidth: "2",
              stroke: "#007AFF"
            },
            propsForBackgroundLines: {
              stroke: "#e3e3e3",
              strokeDasharray: ""
            },
            propsForLabels: {
              fontSize: 12
            }
          }}
          bezier
          style={{
            borderRadius: 16,
            marginVertical: 8,
            paddingLeft: 10 // 👈 Add left padding here
          }}
          segments={2}
          formatYLabel={yValue => {
            if (reverseMap[yValue]) {
              return reverseMap[yValue].replace(" ", "\n"); // 👈 Multi-line labels
            }
            return "";
          }}

        />
      );
    })()
  ) : (
    <Text style={{ color: "gray", textAlign: "center" }}>
      No sleep pattern data available.
    </Text>
  )}
</View>


{/* end sleeppppppp */}

        {/* Activity Level Section */}
        <ActivityLevelSection styles={styles} healthMetrics={healthMetrics} patientId={patientId} />

        <NavBarFamily />
      </ScrollView>
    </View>
  );
}


const moodData = [
  { hour: 8, mood: "Happy" },
  { hour: 10, mood: "Sad" },
  { hour: 14, mood: "Calm" },
  { hour: 16, mood: "Angry" },
  { hour: 20, mood: "Happy" },
];

const moodColors = {
  Happy: "#4CAF50",
  Sad: "#2196F3",
  Angry: "#F44336",
  Calm: "#FF9800",
};

const getX = (hour) => `${5 + (hour / 24) * 90}%`;

const MoodTimeline = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mood Analysis (24 Hours)</Text>
      <Svg height="100" width="100%">
        {/* Timeline Line */}
        <Line x1="5%" y1="50" x2="95%" y2="50" stroke="#ccc" strokeWidth="2" />

        {/* Mood Points */}
        {moodData.map((item, index) => (
          <Circle
            key={index}
            cx={getX(item.hour)}
            cy="50"
            r="8"
            fill={moodColors[item.mood] || "#999"}
          />
        ))}

        {/* Time Labels */}
        {[8, 12, 16, 20, 24].map((hour, index) => (
          <SvgText
            key={index}
            x={getX(hour)}
            y="80"
            fontSize="10"
            textAnchor="middle"
            fill="#555"
          >
            {hour === 24 ? "12 AM" : hour < 12 ? `${hour} AM` : `${hour % 12} PM`}
          </SvgText>
        ))}
      </Svg>
       <View style={styles.legendContainer}>
        {Object.entries(moodColors).map(([mood, color]) => (
          <View key={mood} style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{mood}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};



// Move FallIncidentBarChart outside the main component
const FallIncidentBarChart = ({ data }) => {
  data = data || [3, 0, 1, 4];
  const chartWidth = 400;
  const chartHeight = 200;
  const margin = 40;
  const barWidth = 40;
  const gap = (chartWidth - margin * 2 - barWidth * data.length) / (data.length - 1);
  const maxValue = Math.max(...data, 1);
  const getBarHeight = val => (val / maxValue) * (chartHeight - margin * 2);
  return (
    <View>
      <Svg width={chartWidth} height={chartHeight}>
        <Line x1={margin} y1={margin} x2={margin} y2={chartHeight - margin} stroke="#333" />
        <Line x1={margin} y1={chartHeight - margin} x2={chartWidth - margin} y2={chartHeight - margin} stroke="#333" />
        {data.map((val, i) => {
          const barHeight = getBarHeight(val);
          const x = margin + i * (barWidth + gap);
          const y = chartHeight - margin - barHeight;
          return (
            <Rect key={i} x={x} y={y} width={barWidth} height={barHeight} fill="#f45b69" rx={5} ry={5} />
          );
        })}
        {data.map((_, i) => {
          const x = margin + i * (barWidth + gap) + barWidth / 2;
          return (
            <SvgText key={i} x={x} y={chartHeight - margin + 15} fontSize="12" fill="#333" textAnchor="middle">
              {`Week ${i + 1}`}
            </SvgText>
          );
        })}
        {[0, maxValue / 2, maxValue].map((val, i) => {
          const y = chartHeight - margin - (val / maxValue) * (chartHeight - margin * 2);
          return (
            <SvgText key={i} x={margin - 10} y={y + 4} fontSize="10" fill="#333" textAnchor="end">
              {Math.round(val)}
            </SvgText>
          );
        })}
        <SvgText x={chartWidth / 2} y={margin / 2} fontSize="16" fill="#333" fontWeight="bold" textAnchor="middle">
          Fall/Incident History (Weekly)
        </SvgText>
      </Svg>
    </View>
  );
};


// Move ActivityLevelSection outside of the main component
const ActivityLevelSection = ({ styles, healthMetrics, patientId }) => {
  const barCount =2; // Should be 2
const screenWidth = Dimensions.get("window").width - 40;

  const [activeTab, setActiveTab] = useState("steps");
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);


  // Simulate real dates mapped to current ones
  const today = new Date();

// Simulated mapping (from real past dates to today/tomorrow)
const simulatedDates = {
  "2016-04-12": new Date(today),
  "2016-04-13": new Date(today.getTime() + 86400000),
};

// Ensure fallback for invalid endDate
let endDate = simulatedDates["2016-04-13"];
if (!endDate || isNaN(endDate.getTime())) {
  console.warn("Invalid end date. Falling back to today.");
  endDate = new Date();
}

// Safely generate 7-day range
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(endDate.getTime() - (6 - i) * 86400000);
  if (isNaN(date.getTime())) {
    console.warn("Invalid weekly date generated. Using today instead.");
    return new Date(); // fallback
  }
  return date;
});

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const sundayFirstWeekDates = [...weekDates].sort((a, b) => a.getDay() - b.getDay());

  // Generate weekly data based on simulated mapping
const weeklyData = sundayFirstWeekDates
  .filter((date) => {
    const day = date.getDay();
    return day === 0 || day === 1; // Only Sunday (0) and Monday (1)
  })
  .map((date) => {
    const dayIndex = date.getDay(); // 0 = Sunday
    const dayLabel = daysOfWeek[dayIndex];

    if (dayIndex === 0) {
      // Static Sunday
      return {
        label: dayLabel,
        steps: 7400,
        calories: 250,
        distance: 4.2,
        isStatic: true,
      };
    }

    if (dayIndex === 1) {
      const simulatedDateStr = Object.entries(simulatedDates).find(
        ([realStr, simDate]) => simDate.toDateString() === date.toDateString()
      )?.[0];

      if (!simulatedDateStr) {
        return {
          label: dayLabel,
          steps: null,
          calories: null,
          distance: null,
        };
      }

      const entries = healthMetrics.filter((item) => {
        const raw = item.timestamp || item.created_at;
        if (!raw) return false;
        const itemDate = new Date(raw);
        if (isNaN(itemDate.getTime())) return false;
        const itemDateStr = itemDate.toISOString().split("T")[0];
        return (
          itemDateStr === simulatedDateStr &&
          parseInt(item.patient_id) === parseInt(patientId)
        );
      });

      const steps = entries.reduce((sum, entry) => sum + (entry.steps || 0), 0);
      const calories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      const distance = entries.reduce((sum, entry) => sum + (entry.distance || 0), 0);

      return {
        label: dayLabel,
        steps: entries.length ? steps : null,
        calories: entries.length ? calories : null,
        distance: entries.length ? distance : null,
        isStatic: false,
      };
    }

    return null; // Filtered out anyway
  })
  .filter(Boolean); // Remove nulls



  // Handle missing data by averaging
  const fillMissing = (key) => {
    const validValues = weeklyData.map((d) => d[key]).filter((v) => v !== null);
    const avg = validValues.length
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : 0;
    return weeklyData.map((d) => (d[key] !== null ? d[key] : avg));
  };

 const chartLabels = weeklyData.map((d) => d.label);
const stepsData = weeklyData.map((d) => d.steps ?? 0);
const calorieData = weeklyData.map((d) => d.calories ?? 0);
const distanceData = weeklyData.map((d) => d.distance ?? 0);

const chartData = {
  steps: stepsData,
  calorie: calorieData,
  distance: distanceData,
  time: Array(weeklyData.length).fill(0),
};


  const yAxisSuffix =
    activeTab === "steps"
      ? ""
      : activeTab === "time"
      ? "m"
      : activeTab === "calorie"
      ? "kcal"
      : "km";

  const mondayData = weeklyData.find((d) => d.label === "Mon") || {
  steps: 0,
  calories: 0,
  distance: 0,
};

const totalStats = {
  steps: mondayData.steps?.toLocaleString?.() || "0",
  calorie: mondayData.calories?.toLocaleString?.() || "0",
  distance: mondayData.distance?.toFixed?.(2) || "0.00",
};


  const totalLabel = {
    steps: "Total steps this week",
    time: "Total active time",
    calorie: "Total calories burned",
    distance: "Total distance covered",
  };

  // You can now return the rendered chart and UI using this data.



  return (
   <View>
  <View style={styles.activityLevelContainer}>
    <View style={styles.activityLevelHeader}>
      <Text style={styles.activityLevelTitle}>Activity Level</Text>
      <TouchableOpacity style={styles.dropdown}>
      </TouchableOpacity>
    </View>

   <View style={{ position: "relative", width: screenWidth }}>
  <BarChart
    data={{
      labels: chartLabels,
      datasets: [{ data: chartData[activeTab] }],
    }}
    width={screenWidth}
    height={220}
    fromZero
    yAxisSuffix={yAxisSuffix}
    chartConfig={{
      backgroundGradientFrom: "#e0f7fa",
      backgroundGradientTo: "#e0f7fa",
      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      barPercentage: 0.6,
    }}
    style={styles.chartStyle}
    withInnerLines={false}
    withHorizontalLabels={true}
  />

  {/* Transparent touch zones */}
  {weeklyData.map((_, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setSelectedBarIndex(index)}
      style={{
        position: "absolute",
        top: 0,
        left: (screenWidth / barCount) * index,
        width: screenWidth / barCount,
        height: 220,
        backgroundColor: "transparent",
      }}
    />
  ))}
</View>


    <View style={styles.statsRow}>
      {["steps", "calorie", "distance"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.statsTab,
            activeTab !== tab && styles.inactiveTab,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.statsTabText,
              activeTab !== tab && styles.inactiveTabText,
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.totalStats}>
      <Text style={styles.totalSteps}>{totalStats[activeTab]}</Text>
      <Text style={styles.totalLabel}>{totalLabel[activeTab]}</Text>
    </View>
    {selectedBarIndex === 0 && weeklyData[0]?.isStatic && (
  <Text
    style={{
      marginTop: 10,
      fontSize: 20,
      textAlign: "center",
      color: "#FFF",
      fontWeight: "bold",
    }}
  >
    {`Sunday ${
      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    }: ${
      activeTab === "steps"
        ? weeklyData[0].steps
        : activeTab === "calorie"
        ? weeklyData[0].calories
        : activeTab === "distance"
        ? weeklyData[0].distance?.toFixed?.(2)
        : "N/A"
    }`}
  </Text>
)}

  </View>


  <View style={styles.detailedStats}>
    {/* <View style={styles.statDetail}>
      <Image
        source={{
          uri: "https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png",
        }}
        style={styles.iconImage}
      />
      <Text style={styles.statDetailValue}>{totalStats["time"]}</Text>
      <Text style={styles.statDetailLabel}>Time</Text>
    </View> */}

    <View style={styles.statDetail}>
      <Image
        source={{
          uri: "https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png",
        }}
        style={styles.iconImage}
      />
      <Text style={styles.statDetailValue}>{totalStats["calorie"]}</Text>
      <Text style={styles.statDetailLabel}>Kcal</Text>
    </View>

    <View style={styles.statDetail}>
      <Image
        source={{
          uri: "https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png",
        }}
        style={styles.iconImage}
      />
      <Text style={styles.statDetailValue}>{totalStats["distance"]}</Text>
      <Text style={styles.statDetailLabel}>km</Text>
    </View>
  </View>

<View style={{ marginTop: 20, paddingHorizontal: 20 }}>

</View>


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
   logoutButton: {
    padding: 8,
    position: 'absolute',
    right: 10,
    
  },

alertsContainer: {
  marginTop: 20,
  paddingHorizontal: 10,
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
     right: 120, // Adjust to position the button to the top right
    top: 50,   // Adjust to match header spacing
  },
  reportsButton: {
     backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    position: "absolute",
     right: 250, // Adjust to position the button to the top right
    top: 50, 
  },
  reportsButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
   legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 5,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#444",
  },

  NavBarFamily: {
    position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 60, // adjust as needed
  backgroundColor: "#fff",
  zIndex: 1000, // stays above other elements
  // React Native does not support boxShadow shorthand, use shadow properties below
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  },
  RoutineRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
  RoutineCell: {
    width: 140,
    textAlign: 'center',
    fontSize: 14,
  },
  RoutineHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  RoutineSection: {
    marginTop: 20,
  },
  
});

export default DashboardHeartRateAndStats;