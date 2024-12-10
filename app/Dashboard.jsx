import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBarPatients';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  return (
    <View style={dashboardStyles.container}>
    <ScrollView style={dashboardStyles.container}>
      <Header />
      <NavigationButtons />
      <LineChart />
      {/* <BarChart /> */}
      {/* <StackedBarChart /> */}
      <ActivityBarChart/>
      <Chart />
    </ScrollView>
    <NavBar/>
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

  return (
    <View style={headerStyles.container}>
      <TouchableOpacity style={headerStyles.backButton} onPress={() => navigation.goBack()}>
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
        onPress={() => router.push('/AddUser')} // Navigate to AddUser
      >
        <Icon name="plus-square" size={30} color="#d2416e" />
        <Text style={navStyles.addUserText}>Add User</Text>
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

const LineChart = () => {
  return (
    <View style={lineChartStyles.container}>
      <View style={lineChartStyles.header}>
        <Text style={lineChartStyles.title}>Total Users</Text>
        <View style={lineChartStyles.legendContainer}>
          <View style={lineChartStyles.legendItem}>
            <Circle cx="5" cy="5" r="5" fill="black" />
            <Text style={lineChartStyles.legendText}>Caregiver</Text>
          </View>
          <View style={lineChartStyles.legendItem}>
            <Circle cx="5" cy="5" r="5" fill="lightblue" />
            <Text style={lineChartStyles.legendText}>Patients</Text>
          </View>
        </View>
      </View>
      <View style={lineChartStyles.yAxisLabels}>
        {['40', '30', '20', '10'].map((label, index) => (
          <Text key={index} style={lineChartStyles.yAxisText}>{label}</Text>
        ))}
      </View>
      <Svg height="173" width={width - 40} style={lineChartStyles.chart}>
        <Path
          d="M10 80 Q 52.5 10, 95 80 T 180 80"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M10 100 Q 52.5 40, 95 100 T 180 100"
          stroke="lightblue"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
      </Svg>
      <View style={lineChartStyles.monthsContainer}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
          <Text key={index} style={lineChartStyles.monthText}>{month}</Text>
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1c',
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
    fontSize: 12,
    color: '#1c1c1c',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 10,
    top: 50,
  },
  yAxisText: {
    fontSize: 12,
    color: '#1c1c1c66',
    lineHeight: 43.25,
    textAlign: 'right',
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
});
const Chart = () => {
  return (
    <ScrollView contentContainerStyle={ChartStyles.scrollContainer}>
      <View style={lineChartStyles.container}>
      <Text style={lineChartStyles.title}>User Activity and Engagement</Text>
        <View style={lineChartStyles.header}>
          
          {/* <View style={lineChartStyles.legendContainer}>
            <View style={lineChartStyles.legendItem}>
              <Circle cx="5" cy="5" r="5" fill="blue" />
              <Text style={lineChartStyles.legendText}>Caregiver Activity</Text>
            </View>
            <View style={lineChartStyles.legendItem}>
              <Circle cx="5" cy="5" r="5" fill="red" />
              <Text style={lineChartStyles.legendText}>Patient Activity</Text>
            </View>
          </View> */}
        </View>
        {/* Y-axis Labels */}
        <View style={lineChartStyles.yAxisLabels}>
          {['40', '30', '20', '10', '0'].map((label, index) => (
            <Text key={index} style={lineChartStyles.yAxisText}>{label}</Text>
          ))}
        </View>
        {/* SVG Graph */}
        <Svg height="173" width={width - 40} style={lineChartStyles.chart}>
          {/* Line for Caregiver Activity */}
          <Path
            d="M10 150 Q 30 120, 60 100 T 120 70 T 180 30 T 240 50 T 300 20"
            stroke="green"
            strokeWidth="2"
            fill="none"
          />
          {/* Line for Patient Activity (Dashed) */}
          <Path
            d="M10 140 Q 40 130, 80 110 T 140 90 T 200 60 T 260 80 T 300 40"
            stroke="red"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        </Svg>
        {/* X-axis Labels */}
        <View style={lineChartStyles.monthsContainer}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
            <Text key={index} style={lineChartStyles.monthText}>{month}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const ChartStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  legendContainer: {
    flexDirection: 'row',
  },
  legendItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // marginRight: 15,
  },
  legendText: {

    fontSize: 12,
    color: '#000',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 10,
    top: 50,
  },
  yAxisText: {
    fontSize: 12,
    color: '#000',
    lineHeight: 35,
    textAlign: 'right',
  },
  chart: {
    alignSelf: 'center',
  },
  monthsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  monthText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 100,  // Padding at the bottom to ensure scroll works
  },
});
const ActivityBarChart = () => {
  const data = [12000, 15000, 9500, 17000, 10000]; // Example data for steps taken
  const maxDataValue = 20000; // The maximum steps value (this can be dynamic based on your data)

  return (
    <ScrollView contentContainerStyle={activityBarChartStyles.scrollContainer}>
      <View style={activityBarChartStyles.container}>
      <Text style={activityBarChartStyles.yAxisLabel}>Steps Taken</Text>
        <View style={activityBarChartStyles.chartArea}>
          {data.map((value, index) => (
            <View key={index} style={activityBarChartStyles.barContainer}>
              <View
                style={{
                  ...activityBarChartStyles.bar,
                  height: `${(value / maxDataValue) * 100}%`, // Bar height based on data value
                }}
              />
              <Text style={activityBarChartStyles.xAxisLabel}>{`User ${index + 1}`}</Text>
            </View>
          ))}
        </View>
        
      </View>
    </ScrollView>
  );
};

const activityBarChartStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fb',
    borderRadius: 15,
    marginVertical: 20,
    minHeight: 300,  
    margin:20,// Ensures the chart has a minimum height for display
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    padding: 10,

  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 30,
    backgroundColor: '#156082', // Color of the bar (can change as needed)
    borderRadius: 5,
    marginBottom: 5,
  },
  xAxisLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    fontWeight: '900',
  },
  yAxisLabel: {
    textAlign: 'left',
    fontSize: 15,
    color: '#333',
    fontWeight: '700',
    marginTop: 10,
  },
});

export default Dashboard;
