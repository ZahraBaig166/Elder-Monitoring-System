import React from 'react';
import {useEffect,useState} from "react";
import { FontAwesome } from '@expo/vector-icons';

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Rect, Text as SvgText ,Defs, LinearGradient, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import { router, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        <Chart />
        <LineChart />
        {/* <BarChart /> */}
        {/* <StackedBarChart /> */}
       
      </>
    )}
  </ScrollView>

  {/* <NavBar onChartButtonClick={handleChartButtonClick} /> */}
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

  const handleBackPress = () => {
    router.replace('/'); // Navigate to Login and clear stack
  };
  return (
   <View style={headerStyles.container}>
  {/* Back Button (on the left) */}
  <TouchableOpacity style={headerStyles.backButton} onPress={handleBackPress}>
    <Icon name="arrow-left" size={24} color="#fff" />
  </TouchableOpacity>

  {/* Greeting and Admin Name (center or left aligned depending on layout) */}
  <View style={headerStyles.textContainer}>
    <Text style={headerStyles.greeting}>Hello,</Text>
    <Text style={headerStyles.adminName}>Admin</Text>
  </View>

  {/* Logout Button (on the right) */}
  <TouchableOpacity onPress={logout} style={headerStyles.logoutButton}>
    <FontAwesome name="sign-out" size={34} color="#fff"  />
  </TouchableOpacity>
</View>

  );
};

const headerStyles = StyleSheet.create({
  container: {
    padding: 20,
    position: 'relative',
    top: 30,
  },
  logoutButton: {
    padding: 8,
    position: 'absolute',
    right: 20,
    top: 20,
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
        onPress={() => router.push('/UserQueries')} // Navigate to ViewQuery
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
  marginLeft: 40,
  marginRight: 10,
},
yAxisLabels: {
  position: 'absolute',
  left: 0,
  top: 30,
  height: 300,
  justifyContent: 'space-between',},
});


const Chart = () => {
  const [chartData, setChartData] = React.useState([]);
  const [maxActivity, setMaxActivity] = React.useState(40);

  const BAR_WIDTH = 20;
  const BAR_GAP = 5;
  const GROUP_GAP = 25;
  const MAX_ACTIVITY = 40;

  const { apiBaseUrl } = useConfig();

  React.useEffect(() => {
    fetchWeeklyActivity();
  }, [apiBaseUrl]);

  const fetchWeeklyActivity = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/user-activity/weekly`);
    const data = await response.json();
    console.log('Raw activity data:', data);

    const weeks = [1, 2, 3, 4];

    const preparedData = weeks.map((week) => {
      const caregiver = data.find(
        (d) => d.week_of_month === week && d.user_type === 'caregiver'
      )?.activity_count || 0;

      const family = data.find(
        (d) => d.week_of_month === week && d.user_type === 'family'
      )?.activity_count || 0;

      return { week, caregiver, family };
    });

    setChartData(preparedData);

    // Dynamically determine max activity count for scaling
    const maxCount = Math.max(
      ...preparedData.flatMap(({ caregiver, family }) => [caregiver, family])
    );
    setMaxActivity(Math.max(maxCount, 10)); // minimum 10 to avoid divide-by-zero
  } catch (error) {
    // console.error('Failed to fetch activity data:', error);
  }
};


  // const scaleHeight = (value) => (value / MAX_ACTIVITY) * 150;
  const scaleHeight = (value) => (value / maxActivity) * 150;


return (
  <ScrollView
    contentContainerStyle={ChartStyles.scrollContainer}
    horizontal
    showsHorizontalScrollIndicator={false}
  >
    <View style={ChartStyles.container}>
      <Text style={ChartStyles.title}>Weekly Active Users</Text>

      {/* Y-axis Labels */}
     {/* Y-axis Labels */}
<View style={ChartStyles.yAxisLabels}>
  {Array.from({ length: 5 }, (_, i) => {
    const labelVal = Math.round((maxActivity / 4) * (4 - i));
    return (
      <Text key={i} style={ChartStyles.yAxisText}>
        {labelVal}
      </Text>
    );
  })}
</View>


      {/* Chart Bars */}
      <View>
        <Svg
          height={200}
          width={chartData.length * (BAR_WIDTH * 2 + GROUP_GAP)}
          style={{ marginLeft: 40 }}
        >
          {/* Define Gradients */}
          <Defs>
            <LinearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#4caf50" stopOpacity="1" />
              <Stop offset="100%" stopColor="#087f23" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#2196f3" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0d47a1" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {chartData.map(({ week, caregiver, family }, index) => {
            const groupX = index * (BAR_WIDTH * 2 + GROUP_GAP);

            return (
              <React.Fragment key={week}>
                {/* Caregiver bar with gradient */}
                <Rect
                  x={groupX}
                  y={190 - scaleHeight(caregiver)}
                  width={BAR_WIDTH}
                  height={scaleHeight(caregiver)}
                  fill="url(#greenGradient)"
                  rx={6}
                  ry={6}
                  shadowOpacity={0.3}
                />
                {/* Family bar with gradient */}
                <Rect
                  x={groupX + BAR_WIDTH + BAR_GAP}
                  y={190 - scaleHeight(family)}
                  width={BAR_WIDTH}
                  height={scaleHeight(family)}
                  fill="url(#blueGradient)"
                  rx={6}
                  ry={6}
                  shadowOpacity={0.3}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Week Labels */}
      <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 10 }}>

        {chartData.map(({ week }, index) => (
            <View
              key={`week-label-${week}`}
              style={{
                width: BAR_WIDTH * 2.2 + BAR_GAP,
                alignItems: 'center',
                marginRight: GROUP_GAP - BAR_GAP,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600' }}>{`Week ${week}`}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={ChartStyles.legendContainer}>
        <View style={ChartStyles.legendItem}>
          <View
            style={[ChartStyles.colorBox, { backgroundColor: '#4caf50' }]}
          />
          <Text style={ChartStyles.legendText}>Caregiver</Text>
        </View>
        <View style={ChartStyles.legendItem}>
          <View
            style={[ChartStyles.colorBox, { backgroundColor: '#2196f3' }]}
          />
          <Text style={ChartStyles.legendText}>Family</Text>
        </View>
      </View>
    </View>
  </ScrollView>
);
};


const ChartStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginBottom: -60, // Ensure space for the navbar
    minWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 40,
    height: 150,
    justifyContent: 'space-between',
  },
  yAxisText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'right',
    paddingRight: 5,
    top: 60,
    left: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
});


const ActivityBarChart = () => {
  const [caregivers, setCaregivers] = useState([]);
   const { apiBaseUrl } = useConfig();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/caregiver-performance`);
        if (!response.ok) {
          // throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCaregivers(data);
      } catch (error) {
        // console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Caregiver Performance</Text>
      {caregivers.map((c, index) => {
        const alertPercent = parseFloat(c.acknowledgedPercent) || 0;
        const unackPercent = (100 - alertPercent).toFixed(1);

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.total}>Total Alerts: {c.totalAlerts}</Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressSegment,
                  {
                    width: `${alertPercent}%`,
                    backgroundColor: '#4ECDC4',
                  },
                ]}
              >
                <Text style={styles.segmentLabel}>{alertPercent}%</Text>
              </View>
              <View
                style={[
                  styles.progressSegment,
                  {
                    width: `${unackPercent}%`,
                    backgroundColor: '#FF6B6B',
                  },
                ]}
              >
                <Text style={styles.segmentLabel}>{unackPercent}%</Text>
              </View>
            </View>

            <View style={styles.labelRow}>
             <Text style={styles.label}>✔️ Acknowledged: {c.acknowledged}</Text>
            <Text style={styles.label}>❌ Unacknowledged: {c.unacknowledged}</Text>

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
