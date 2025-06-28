import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Svg, Line, Path, Text as SvgText , Circle, FeSpecularLighting , Rect } from 'react-native-svg';
import { BarChart } from 'react-native-chart-kit';
import { Link, router } from 'expo-router';
import NavBar from '../components/NavBarPatients';
import useConfig from "../hooks/useConfig";
import useAuth from "../hooks/useAuth";

const { width } = Dimensions.get('window');

const DoctorDashboard = () => {
  const [counts, setCounts] = useState({ total: 0, critical: 0, moderate: 0, stable: 0 });
  const [loading, setLoading] = useState(true);
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [medicationSchedule, setMedicationSchedule] = useState([]);
  const [isMedScheduleExpanded, setIsMedScheduleExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { apiBaseUrl, loading: configLoading } = useConfig();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!apiBaseUrl) return;
    const fetchPatientCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/patients/counts`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error('Error fetching patient counts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientCounts();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!apiBaseUrl || !user?.userId) return;
    const fetchCriticalPatientsForCaregiver = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/patients`);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        const criticalOnly = data.filter(p => p.status === 'critical');
        setCriticalPatients(criticalOnly);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setCriticalPatients([]);
      }
    };
    fetchCriticalPatientsForCaregiver();
  }, [apiBaseUrl, user?.userId]);

  useEffect(() => {
    if (!apiBaseUrl || !user?.userId) return;
    
    const fetchMedicationSchedule = async () => {
   
      try {
        const response = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/medications/counts`);

        if (!response.ok) throw new Error(`Failed to fetch medications: ${response.statusText}`);
        const data = await response.json();
        console.log("Medication Schedule Data:", data); // Debugging line
        
        // Ensure medicationSchedules is an array before sorting
        if (Array.isArray(data.medicationSchedules)) {
          const sortedMedications = data.medicationSchedules.sort((a, b) => a.time.localeCompare(b.time));
          setMedicationSchedule(sortedMedications);
        } else {
          console.error('Error: Medication schedules are not an array', data.medicationSchedules);
          setMedicationSchedule([]);
        }
      } catch (error) {
        console.error('Error fetching medication schedule:', error);
        setMedicationSchedule([]);
      }
    };
    
    fetchMedicationSchedule();
  }, [apiBaseUrl, user?.userId]);
  
  const PatientInfoCard = ({ counts }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.totalPatientsText}>
        Total Patients: <Text style={styles.totalNumber}>{counts.total || 0}</Text>
      </Text>
      <View style={styles.statusContainer}>
        <View style={styles.statusBox}>
          <FontAwesome name="exclamation-circle" size={46} color="#ff5053" style={styles.statusIcon} />
          <Text style={styles.criticalText}>Critical</Text>
          <Text style={styles.criticalNumber}>{counts.critical || 0}</Text>
        </View>
        <View style={styles.statusBox}>
          <FontAwesome name="bed" size={46} color="#da840d" style={styles.statusIcon} />
          <Text style={styles.moderateText}>Moderate</Text>
          <Text style={styles.moderateNumber}>{counts.moderate || 0}</Text>
        </View>
        <View style={styles.statusBox}>
          <FontAwesome name="user" size={46} color="#48742c" style={styles.statusIcon} />
          <Text style={styles.stableText}>Stable</Text>
          <Text style={styles.stableNumber}>{counts.stable || 0}</Text>
        </View>
      </View>
    </View>
  );

  const CriticalPatientList = () => (
    <View style={styles.criticalListContainer}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.headerContainer}>
        <Text style={styles.title}>Critical Patient List</Text>
        <FontAwesome
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#000"
          style={styles.filterIcon}
        />
      </TouchableOpacity>
      {isExpanded && (
        criticalPatients.length > 0 ? (
          criticalPatients.map((patient) => (
            <View key={patient.patient_id} style={styles.card}>
              <FontAwesome name="user" size={24} color="#000" style={styles.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{patient.name}</Text>
                <Text style={styles.condition}>{patient.medical_conditions}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No critical patients found.</Text>
        )
      )}
    </View>
  );

  const MedicationScheduleList = () => (
    <View style={styles.criticalListContainer}>
      <TouchableOpacity onPress={() => setIsMedScheduleExpanded(!isMedScheduleExpanded)} style={styles.headerContainer}>
        <Text style={styles.title}>Medication Schedule</Text>
        <FontAwesome
          name={isMedScheduleExpanded ? "chevron-up" : "chevron-down"}
          size={22}
          color="#000"
          style={styles.filterIcon}
        />
      </TouchableOpacity>
      {isMedScheduleExpanded && (
        medicationSchedule.length > 0 ? (
          medicationSchedule.map((med, index) => (
            <View key={index} style={styles.card}>
              <FontAwesome name="medkit" size={24} color="#000" style={styles.avatar} />
              <View style={styles.infoContainer}>
                    <Text style={styles.name}>{med.patient_name}</Text>
      <Text style={styles.medicationname}>{med.medication_name}</Text>
      <Text style={styles.condition}>Time: {med.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No medications scheduled.</Text>
        )
      )}
    </View>
  );

  const ChartWithHeading = ({ title, source }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Image source={source} style={styles.chartImage} />
    </View>
  );

  if (configLoading || loading || authLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.dashboardContainer}>
      <ScrollView style={styles.dashboadContainer}>
        <View style={styles.header}>
          <Image source={{ uri: 'https://placeholder.pics/svg/50x50' }} style={styles.profileImage} />
          <Text style={styles.welcomeText}>Welcome {user?.name || "Doctor"}</Text>
          <Text style={styles.subText}>Have a Nice day</Text>
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>Search....</Text>
            <Image source={{ uri: 'https://placeholder.pics/svg/20x20' }} style={styles.searchIcon} />
          </View>
        </View>
      
        <PatientInfoCard counts={counts} />
        <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/ViewPatients')}>
          <Text style={styles.viewAllButtonText}>View All Patients</Text>
        </TouchableOpacity>

        <CriticalPatientList />
        <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/AddMedication')}>
          <Text style={styles.viewAllButtonText}>Add Medication</Text>
        </TouchableOpacity>

              <MedicationScheduleList /><View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Patient Status Transition Trends</Text>
            <PatientTrendChart />
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.alertsContainer}>
  <Text style={styles.sleepPatternTitle}>Patient Alerts This Week</Text>
  <BarChart
    data={{
      labels: ["Ali", "Sara", "Ahmed", "Noor", "Hassan"],
      datasets: [
        {
          data: [4, 7, 2, 5, 3], // Number of alerts per patient
        },
      ],
    }}
    width={Dimensions.get("window").width - 55}
    height={220}
    fromZero
    chartConfig={{
      backgroundGradientFrom: "#ADC1D8",
      backgroundGradientTo: "#ADC1D8",
      color: (opacity = 1) => `rgba(50, 115, 220, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      decimalPlaces: 0,
      propsForLabels: {
        fontSize: 12,
      },
    }}
    style={{
      marginVertical: 8,
      borderRadius: 15,
    }}
  />
</View>
    
            {/* <FallIncidentBarChart /> */}
          </View>

        {/* <ChartWithHeading title="Heart Rate Trends" source={require('../assets/images/G2.png')} /> */}
        <ChartWithHeading title=" Patient Location" source={require('../assets/images/G3.png')} />
        {/* <ChartWithHeading title="Activity Levels Over Time" source={require('../assets/images/G4.png')} /> */}
      </ScrollView>
      <NavBar />
    </View>
  );
  
};
const PatientTrendChart = () => {
  // Example data: each array is number of patients per status for each week
  const criticalData = [10, 6, 5, 2];   // 🔴 Decreasing
  const moderateData = [5, 6, 7, 5];    // 🟠 Varies
  const stableData = [2, 3, 5, 10];     // 🟢 Increasing

  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const chartWidth = 340;
  const chartHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingBottom = 30;
  const paddingTop = 20;

  const maxY = Math.max(...criticalData, ...moderateData, ...stableData);
  const yScale = (chartHeight - paddingTop - paddingBottom) / maxY;
  const xGap = (chartWidth - paddingLeft - paddingRight) / (labels.length - 1);

  const getX = (i) => paddingLeft + i * xGap;
  const getY = (value) => chartHeight - paddingBottom - value * yScale;

  const buildPath = (data) => {
    return data.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ');
  };

  return (
    <Svg width={chartWidth} height={chartHeight + 20}>
      {/* Y-axis Labels */}
      {[0, maxY / 2, maxY].map((val) => (
        <SvgText
          key={val}
          x={paddingLeft - 10}
          y={getY(val)}
          fontSize="13"
          fill="#333"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {Math.round(val)}
        </SvgText>
      ))}

      {/* Horizontal lines */}
      {[0, maxY / 2, maxY].map((val) => (
        <Line
          key={val}
          x1={paddingLeft}
          y1={getY(val)}
          x2={chartWidth - paddingRight}
          y2={getY(val)}
          stroke="#eee"
        />
      ))}

      {/* Lines */}
      <Path d={buildPath(criticalData)} stroke="red" strokeWidth={3} fill="none" />
      <Path d={buildPath(moderateData)} stroke="orange" strokeWidth={2} fill="none" />
      <Path d={buildPath(stableData)} stroke="green" strokeWidth={2} fill="none" />

      {/* Points */}
      {[criticalData, moderateData, stableData].map((dataset, idx) => {
        const color = ['red', 'orange', 'green'][idx];
        return dataset.map((val, i) => (
          <Circle
            key={`${idx}-${i}`}
            cx={getX(i)}
            cy={getY(val)}
            r={3}
            fill={color}
          />
        ));
      })}

      {/* X-axis Labels */}
      {labels.map((label, i) => (
        <SvgText
          key={label}
          x={getX(i)}
          y={chartHeight + 10}
          fontSize="12"
          fill="#333"
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}

      {/* Legend */}
      <SvgText x={paddingLeft} y={15} paddingBottom='20' fontSize="10" fill="red">● Critical</SvgText>
      <SvgText x={paddingLeft + 80} y={15} paddingBottom='20' fontSize="10" fill="orange">● Moderate</SvgText>
      <SvgText x={paddingLeft + 190} y={15} paddingBottom='20' fontSize="10" fill="green">● Stable</SvgText>
    </Svg>
  );
};

// const FallIncidentBarChart = ({ data }) => {
//   // Example data: number of incidents per week (4 weeks)
//   // data = [3, 0, 1, 4];
//   data = data || [3, 0, 1, 4];

//   const chartWidth = 350;
//   const chartHeight = 200;
//   const margin = 40;
//   const barWidth = 40;
//   const gap = (chartWidth - margin * 2 - barWidth * data.length) / (data.length - 1);

//   const maxValue = Math.max(...data, 1);

//   // Scale bar height
//   const getBarHeight = val => (val / maxValue) * (chartHeight - margin * 2);

//   return (
//     <View>
//       <Svg width={chartWidth} height={chartHeight}>
//         {/* Y-axis */}
//         <Line
//           x1={margin}
//           y1={margin}
//           x2={margin}
//           y2={chartHeight - margin}
//           stroke="#333"
//         />
//         {/* X-axis */}
//         <Line
//           x1={margin}
//           y1={chartHeight - margin}
//           x2={chartWidth - margin}
//           y2={chartHeight - margin}
//           stroke="#333"
//         />

//         {/* Bars */}
//         {data.map((val, i) => {
//           const barHeight = getBarHeight(val);
//           const x = margin + i * (barWidth + gap);
//           const y = chartHeight - margin - barHeight;
//           return (
//             <Rect
//               key={i}
//               x={x}
//               y={y}
//               width={barWidth}
//               height={barHeight}
//               fill="#f45b69"
//               rx={5}
//               ry={5}
//             />
//           );
//         })}

//         {/* X-axis labels (Week 1, Week 2...) */}
//         {data.map((_, i) => {
//           const x = margin + i * (barWidth + gap) + barWidth / 2;
//           return (
//             <SvgText
//               key={i}
//               x={x}
//               y={chartHeight - margin + 15}
//               fontSize="12"
//               fill="#333"
//               textAnchor="middle"
//             >
//               {`Week ${i + 1}`}
//             </SvgText>
//           );
//         })}

//         {/* Y-axis labels */}
//         {[0, maxValue / 2, maxValue].map((val, i) => {
//           const y = chartHeight - margin - (val / maxValue) * (chartHeight - margin * 2);
//           return (
//             <SvgText
//               key={i}
//               x={margin - 10}
//               y={y + 4}
//               fontSize="10"
//               fill="#333"
//               textAnchor="end"
//             >
//               {Math.round(val)}
//             </SvgText>
//           );
//         })}

//         {/* Chart title */}
//         <SvgText
//           x={chartWidth / 2}
//           y={margin / 2}
//           fontSize="16"
//           fill="#333"
//           fontWeight="bold"
//           textAnchor="middle"
//         >
//           Fall/Incident History (Weekly)
//         </SvgText>
//       </Svg>
//     </View>
//   );
// };


const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#e6eaf0',
      paddingBottom: 80, 
    
  },
  header: {
    backgroundColor: '#b0c4de',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '90%',
    height: 40,
  },
  queryButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5,
  },
  queryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchText: {
    flex: 1,
    color: '#aaa',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  medicationListContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 10,
  },
  medicationList: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterIcon: {
    marginRight: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b0c4de',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  medicationname: {
    fontSize: 11,
    paddingTop: 5,
  },
  condition: {
    fontSize: 12,
    color: '#666',
  },
  detailsButton: {
    marginTop: 5,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
     width: 60,  
    justifyContent: 'center',
    alignItems: 'center',

  },
  detailsText: {
    fontSize: 12,
    color: '#263238',
  },
  ScheduleButton: {
    backgroundColor: '#fff',
    paddingTop: 5,
    marginTop: 5,
    borderRadius: 5,
    width: 110,
    height: 30,
    
  },
  ScheduleText: {
    fontSize: 12,
    color: '#263238',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },

  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#b0c4de',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: 390,
    height: 73,
  },
  iconContainer: {
    padding: 10,
  },
  iconContainerActive: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  cardContainer: {
    backgroundColor: '#f0f4f7',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 377,
    height: 201,
    marginVertical: 10,
    
  },
  totalPatientsText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  totalNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statusBox: {
    backgroundColor: '#cfd8dc',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 108,
    height: 107,
  },
  statusIcon: {
    marginBottom: 5,
  },
  criticalText: {
    color: '#ff5053',
    fontWeight: '600',
    fontSize: 16,
  },
  criticalNumber: {
    color: '#ef3034',
    fontWeight: '800',
    fontSize: 18,
  },
  moderateText: {
    color: '#da840d',
    fontWeight: '600',
    fontSize: 16,
  },
  moderateNumber: {
    color: '#da840d',
    fontWeight: '800',
    fontSize: 18,
  },
  stableText: {
    color: '#48742c',
    fontWeight: '600',
    fontSize: 16,
  },
  stableNumber: {
    color: '#48742c',
    fontWeight: '800',
    fontSize: 18,
  },
  criticalListContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 10,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterIcon: {
    marginRight: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b0c4de',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  condition: {
    fontSize: 12,
    color: '#666',
  },
  
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
    criticalListContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 15,
      marginVertical: 20,
      marginHorizontal: 15,
      borderRadius: 10,

    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    filterIcon: {
      marginRight: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#b0c4de',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    avatar: {
      marginRight: 10,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 14,
      fontWeight: '600',
    },
    condition: {
      fontSize: 12,
      color: '#666',
    },
    detailsButton: {
      marginTop: 5,
      backgroundColor: '#fff',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    detailsText: {
      fontSize: 12,
      color: '#263238',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 60,
    },
    viewAllButton: {
      backgroundColor: '#4CAF50', // Green background
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10, // Space above and below the button
      marginHorizontal: 20, // Space from the sides
    },
    viewAllButtonText: {
      color: '#FFFFFF', // White text
      fontSize: 16,
      fontWeight: '600',
    },

    chartContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  margin: 10,
  elevation: 2,
},
chartTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 10,
},
alertsContainer: {
  marginTop: 20,
  paddingHorizontal: 10,
},
    
});

export default DoctorDashboard;