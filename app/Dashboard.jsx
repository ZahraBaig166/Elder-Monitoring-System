import React from 'react';
import {useEffect,useState} from "react";


import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Text as SvgText} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import { router, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import { useFocusEffect } from 'expo-router';

// import { BackHandler } from 'react-native';


const { width } = Dimensions.get('window');

const Dashboard = () => {

  const { apiBaseUrl, loading, error } = useConfig();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       router.replace('/'); // Replace with Login screen
  //       return true; // Prevent default back behavior
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [])
  // );

  const [showCharts, setShowCharts] = useState(false); // State to toggle charts view

  const handleChartButtonClick = () => {
    setShowCharts(true); // Set to show charts only
  };
 
  
  return (
    <View style={dashboardStyles.container}>
  <ScrollView
    style={dashboardStyles.container}
    contentContainerStyle={{ paddingBottom: 100 }} // Add extra bottom padding
    showsVerticalScrollIndicator={false}
  >
    {/* Conditionally render content */}
    {showCharts ? (
      <>
        {/* Render only charts */}

          <ActivityBarChart />
        <LineChart />
      
        <Chart />
      </>
    ) : (
      <>
        {/* Render full dashboard */}
        <Header />
        <NavigationButtons />

        
        <ActivityBarChart/>
        <LineChart />
        {/* <BarChart /> */}
        {/* <StackedBarChart /> */}
       
        <Chart />
      </>
    )}
  </ScrollView>

  <NavBar onChartButtonClick={handleChartButtonClick} />
</View>
);
};

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#adc1d8',
  },
});


const Header = () => {

  const navigation = useNavigation(); // Access navigation
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       router.replace('/'); // Replace with Login screen
  //       return true; // Prevent default back behavior
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [])
  // );

  const handleBackPress = () => {
    router.replace('/'); // Navigate to Login and clear stack
  };
  return (
    <View style={headerStyles.container}>
      <TouchableOpacity style={headerStyles.backButton} onPress={handleBackPress} >
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={headerStyles.greeting}>Hello,</Text>
      <Text style={headerStyles.adminName}>Admin</Text>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    padding: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  greeting: {
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 39.06,
    color: '#061428',
    marginLeft: 50, // Adjust to prevent overlap with the back button
  },
  adminName: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 62.5,
    color: '#fff',
    marginLeft: 50, // Adjust to prevent overlap with the back button
  },
});

const NavigationButtons = () => {
  const router = useRouter();

  return (
    <View style={navStyles.container}>
      <TouchableOpacity
        style={[navStyles.button, navStyles.addUser]}
        // onPress={() => router.replace('/AddUser')} // Navigate to AddUser
      >
        <Icon name="plus-square" size={30} color="#d2416e" />
        <Text style={navStyles.addUserText}>View Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[navStyles.button, navStyles.viewUser]}
        onPress={() => router.push('/ViewUser')} // Navigate to ViewUser
      >
        <Icon name="user" size={30} color="#7042c9" />
        <Text style={navStyles.viewUserText}>View User</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[navStyles.button, navStyles.addPatient]}
        onPress={() => router.push('/ViewRequest')} // Navigate to AddPatient
      >
        <Icon name="plus-square" size={30} color="#0db1ad" />
        <Text style={navStyles.addPatientText}>View Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[navStyles.button, navStyles.viewQuery]}
        onPress={() => router.push('/Queries')} // Navigate to ViewQuery
      >
        <Icon name="comments" size={30} color="#157fdd" />
        <Text style={navStyles.viewQueryText}>View Query</Text>
      </TouchableOpacity>
    </View>
  );
};

const navStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    width: 131.43,
    height: 110.77,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 28,
    height: 27,
    marginBottom: 10,
  },
  addUser: {
    backgroundColor: '#f8d7da',
  },
  viewUser: {
    backgroundColor: '#d1e7dd',
  },
  addPatient: {
    backgroundColor: '#cff4fc',
  },
  viewQuery: {
    backgroundColor: '#cfe2f3',
  },
  addUserText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d2416e',
  },
  viewUserText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7042c9',
  },
  addPatientText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0db1ad',
  },
  viewQueryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#157fdd',
  },
});

const monthsInYear = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getMonthIndex = (monthStr) => parseInt(monthStr.split('-')[1], 10) - 1;

const LineChart = () => {
  const [caregiverData, setCaregiverData] = React.useState([]);
  const [familyData, setFamilyData] = React.useState([]);
  const [months, setMonths] = React.useState([]);
  const { apiBaseUrl } = useConfig();

  React.useEffect(() => {
    fetchChartData();
  }, [apiBaseUrl]);

  const fetchChartData = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/chart`);
      const result = await res.json();

      if (res.ok && result.caregiverCounts && result.familyCounts && result.months) {
        setCaregiverData(result.caregiverCounts);
        setFamilyData(result.familyCounts);
        setMonths(result.months);
      } else {
        setCaregiverData([]);
        setFamilyData([]);
        setMonths([]);
        // Alert.alert('No chart data found.');
      }
    } catch (err) {
      // console.error(err);
      // Alert.alert('Error', 'Failed to load chart data');
    }
  };

  const chartHeight = 300;
  const chartWidth = width - 80;

  const maxCount = Math.max(...caregiverData, ...familyData, 1); // for dynamic Y range
  const yGap = chartHeight / maxCount;
  const xGap = months.length > 1 ? chartWidth / (months.length - 1) : chartWidth;

  // Convert count to Y position
  const getYPos = (val) => chartHeight - (val / maxCount) * chartHeight;

  // Convert month index to X position
  const getXPos = (index) => index * xGap;

  // Generate SVG path for the line
  const generatePath = (data, color, dashed = false) => {
    if (!data.length || !months.length) return null;

    let path = '';
    data.forEach((count, i) => {
      const x = getXPos(i);
      const y = getYPos(count);
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });

    return (
      <Path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? '6,4' : undefined}
      />
    );
  };

  return (
    <View style={lineChartStyles.container}>
      <Text style={lineChartStyles.title}>Monthly User Registrations</Text>

      {/* Legend */}
      <View style={lineChartStyles.legendContainer}>
        <View style={lineChartStyles.legendItem}>
          <View style={{ width: 16, height: 2, backgroundColor: 'black' }} />
          <Text style={lineChartStyles.legendText}>Caregiver</Text>
        </View>
        <View style={lineChartStyles.legendItem}>
          <View
            style={{
              width: 20,
              height: 2,
              backgroundColor: 'lightblue',
              borderStyle: 'dashed',
            }}
          />
          <Text style={lineChartStyles.legendText}>Family</Text>
        </View>
      </View>

      {/* Y-Axis Label
      <Text style={{ position: 'absolute', top:30, left: 0, fontSize: 13, color: '#999' }}>
        Users
      </Text> */}

      {/* Y-Axis Labels */}
      <View style={lineChartStyles.yAxisLabels}>
        {[...Array(maxCount + 1).keys()].reverse().map((val) => (
          <Text key={val} style={lineChartStyles.yAxisText}>
            {val}
          </Text>
        ))}
      </View>

      {/* Chart */}
      <Svg height={chartHeight} width={chartWidth} style={lineChartStyles.chart}>
        {[...Array(maxCount + 1).keys()].map((val) => {
          const y = getYPos(val);
          return (
            <Line
              key={val}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#eee"
              strokeWidth={2}
            />
          );
        })}
        {generatePath(caregiverData, 'black')}
        {generatePath(familyData, 'lightblue', true)}
      </Svg>

      {/* X Axis Labels */}
      <View style={lineChartStyles.monthsContainer}>
        {months.map((monthStr, i) => (
          <Text key={i} style={lineChartStyles.monthText}>
            {monthsInYear[getMonthIndex(monthStr)]}
          </Text>
        ))}
      </View>
    </View>
  );
};

const lineChartStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f9fb',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1c',
    padding: 10,
  },
  legendContainer: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  legendText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#1c1c1c',
    paddingBottom: 10,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 10,
    // top: 30,
  },
  yAxisText: {
    fontSize: 16,
    color: '#1c1c1c66',
    lineHeight: 15.25,
    textAlign: 'right',
    top: 60,
     // Adjust to align with Y axis
    
  },
  chart: {
    alignSelf: 'center',
    marginLeft: 30,
  },
  monthsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  monthText: {
    fontSize: 12,
    color: '#1c1c1c66',
    textAlign: 'center',
  },
  chart: {
  alignSelf: 'center',
  marginLeft: 40, // aligns X axis with Y axis
  marginRight: 10,
},
yAxisLabels: {
  position: 'absolute',
  left: 0,
  top: 30,
  height: 300,
  justifyContent: 'space-between',},
});


// const Chart = () => {
//  const [chartData, setChartData] = React.useState([]);


//  const { apiBaseUrl } = useConfig();

//   React.useEffect(() => {
//     fetchWeeklyActivity();
//   }, [apiBaseUrl]); 

//     const fetchWeeklyActivity = async () => {
//   try {
//     const response = await fetch(`${apiBaseUrl}/user-activity/weekly`);
    
//     // Check if response is OK before parsing
   

//     const data = await response.json(); // Correct way to parse
//     console.log('Raw activity data:', data);

//     const weeks = [...new Set(data.map(d => d.week_of_month))].sort();

//     const preparedData = weeks.map(week => {
//       const caregiver = data.find(d => d.week_of_month === week && d.user_type === 'caregiver')?.activity_count || 0;
//       const family = data.find(d => d.week_of_month === week && d.user_type === 'family')?.activity_count || 0;
//       return { week, caregiver, family };
//     });

//     setChartData(preparedData);
//   } catch (error) {
//     console.error('Failed to fetch activity data:', error);
//   }
// };


  
//   // Scale bar height relative to max activity value
//   const scaleHeight = (value) => (value / MAX_ACTIVITY) * 150; // 150 is max height in px

//   return (
//     <ScrollView contentContainerStyle={ChartStyles.scrollContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
//       <View style={ChartStyles.container}>
//         <Text style={ChartStyles.title}>User Activity and Engagement</Text>

//         {/* Y-axis Labels */}
//         <View style={ChartStyles.yAxisLabels}>
//           {['40', '30', '20', '10', '0'].map((label, index) => (
//             <Text key={index} style={ChartStyles.yAxisText}>{label}</Text>
//           ))}
//         </View>

//         {/* Chart Bars */}
//         <Svg height={200} width={Math.max(width, chartData.length * (BAR_WIDTH * 2 + GROUP_GAP))} style={{ marginLeft: 40 }}>
//           {chartData.map(({ week, caregiver, family }, index) => {
//             const groupX = index * (BAR_WIDTH * 2 + GROUP_GAP);

//             return (
//               <React.Fragment key={week}>
//                 {/* Caregiver bar (green) */}
//                 <Rect
//                   x={groupX}
//                   y={150 - scaleHeight(caregiver)}
//                   width={BAR_WIDTH}
//                   height={scaleHeight(caregiver)}
//                   fill="green"
//                   rx={3}
//                   ry={3}
//                 />
//                 {/* Family bar (blue) */}
//                 <Rect
//                   x={groupX + BAR_WIDTH + BAR_GAP}
//                   y={150 - scaleHeight(family)}
//                   width={BAR_WIDTH}
//                   height={scaleHeight(family)}
//                   fill="blue"
//                   rx={3}
//                   ry={3}
//                 />
//                 {/* Week label */}
//                 <Text
//                   x={groupX + BAR_WIDTH}
//                   y={170}
//                   fill="#000"
//                   fontSize="12"
//                   fontWeight="bold"
//                   textAnchor="middle"
//                 >
//                   {`Week ${week}`}
//                 </Text>
//               </React.Fragment>
//            );
//           })}
//         </Svg>

//         {/* Legend */}
//         <View style={ChartStyles.legendContainer}>
//           <View style={ChartStyles.legendItem}>
//             <View style={[ChartStyles.colorBox, { backgroundColor: 'green' }]} />
//             <Text style={ChartStyles.legendText}>Caregiver</Text>
//           </View>
//           <View style={ChartStyles.legendItem}>
//             <View style={[ChartStyles.colorBox, { backgroundColor: 'blue' }]} />
//             <Text style={ChartStyles.legendText}>Family</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const ChartStyles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     margin: 20,
//     minWidth: width,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 10,
//   },
//   yAxisLabels: {
//     position: 'absolute',
//     left: 0,
//     top: 40,
//     height: 150,
//     justifyContent: 'space-between',
//   },
//   yAxisText: {
//     fontSize: 12,
//     color: '#000',
//     textAlign: 'right',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     justifyContent: 'center',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//   },
//   legendText: {
//     fontSize: 14,
//     marginLeft: 5,
//     color: '#000',
//   },
//   colorBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//   },
//   scrollContainer: {
//     paddingBottom: 100,
//   },
// });



const BAR_WIDTH = 20;
const BAR_GAP = 5;
const GROUP_GAP = 25;
const MAX_ACTIVITY = 30; // for scaling

const Chart = () => {
  // Static sample data
  const chartData = [
    { week: 1, caregiver: 12, family: 18 },
    { week: 2, caregiver: 25, family: 10 },
    { week: 3, caregiver: 18, family: 30 },
    { week: 4, caregiver: 22, family: 16 },
  ];

  // Scale bar height relative to max activity value
   const scaleHeight = (value) => (value / MAX_ACTIVITY) * 150;

  return (
    <View style={ChartStyles.container}>
      <Text style={ChartStyles.title}>User Activity (Weekly)</Text>

      {/* Y-axis title */}
      <Text style={ChartStyles.yAxisTitle}>Activity Count</Text>

      {/* Y-axis Labels */}
      <View style={ChartStyles.yAxisLabels}>
        {[50, 40, 30, 20, 10, 0].map((label) => (
          <Text key={label} style={ChartStyles.yAxisText}>{label}</Text>
        ))}
      </View>

      {/* Chart Area */}
      <View style={ChartStyles.chartArea}>
        <Svg height={180} width={width - 60}>
          {chartData.map(({ week, caregiver, family }, index) => {
            const groupX = index * (BAR_WIDTH * 2 + GROUP_GAP);

            return (
              <React.Fragment key={week}>
                {/* Caregiver bar */}
                <Rect
                  x={groupX}
                  y={150 - scaleHeight(caregiver)}
                  width={BAR_WIDTH}
                  height={scaleHeight(caregiver)}
                  fill="green"
                  rx={4}
                />
                {/* Family bar */}
                <Rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={150 - scaleHeight(family)}
                  width={BAR_WIDTH}
                  height={scaleHeight(family)}
                  fill="blue"
                  rx={4}
                />
                {/* Week label */}
                <SvgText
                  x={groupX + BAR_WIDTH}
                  y={170}
                  fill="#000"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {`W${week}`}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={ChartStyles.legendContainer}>
        <View style={ChartStyles.legendItem}>
          <View style={[ChartStyles.colorBox, { backgroundColor: 'green' }]} />
          <Text style={ChartStyles.legendText}>Caregiver</Text>
        </View>
        <View style={ChartStyles.legendItem}>
          <View style={[ChartStyles.colorBox, { backgroundColor: 'blue' }]} />
          <Text style={ChartStyles.legendText}>Family</Text>
        </View>
      </View>
    </View>
  );
};

const ChartStyles = StyleSheet.create({
 container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    width: '90%',
    alignSelf: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  yAxisTitle: {
    position: 'absolute',
    top: 120,
    left: -20,
    transform: [{ rotate: '-90deg' }],
    fontSize: 12,
    color: '#444',
    width: 120,
    textAlign: 'center',
  },
  yAxisLabels: {
    position: 'absolute',
    top: 50,
    left: 0,
    height: 150,
    justifyContent: 'space-between',
  },
  yAxisText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
    width: 30,
  },
  chartArea: {
    marginLeft: 40,
    height: 180,
    overflow: 'hidden',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});
const ActivityBarChart = () => {
  const caregivers = [
    { name: 'Caregiver 1', queries: 10, alerts: 5 },
    { name: 'Caregiver 2', queries: 7, alerts: 8 },
    { name: 'caregiver3', queries: 12, alerts: 4 },
    { name: 'caregiver4', queries: 9, alerts: 6 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caregiver Performance</Text>
      {caregivers.map((c, index) => {
        const total = c.queries + c.alerts;
        const queryPercent = ((c.queries / total) * 100).toFixed(1);
        const alertPercent = ((c.alerts / total) * 100).toFixed(1);

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.total}>Total: {total} responses</Text>

            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, { width: `${queryPercent}%`, backgroundColor: '#4ECDC4' }]}>
                <Text style={styles.segmentLabel}>{queryPercent}%</Text>
              </View>
              <View style={[styles.progressSegment, { width: `${alertPercent}%`, backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.segmentLabel}>{alertPercent}%</Text>
              </View>
            </View>

            <View style={styles.labelRow}>
              <Text style={styles.label}>Queries: {c.queries}</Text>
              <Text style={styles.label}>Alerts: {c.alerts}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    // textAlign: 'center',
  },
  card: {
    backgroundColor: '#f1f8ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  total: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  progressSegment: {
    height: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: '#444',
  },
  segmentLabel: {
  color: '#fff',
  fontSize: 10,
  textAlign: 'center',
  fontWeight: 'bold',
  paddingHorizontal: 2,
},

});

export default Dashboard;
