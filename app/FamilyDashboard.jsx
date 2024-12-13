import React from "react";
import {useEffect} from "react";

import { View, Text, StyleSheet, Image, Dimensions, ScrollView,TouchableOpacity } from "react-native";
import { LineChart,BarChart } from "react-native-chart-kit";
import NavBar from '../components/NavBar';
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";


const DashboardHeartRateAndStats = () => {
  const router = useRouter();  // Initialize useRouter
  const { apiBaseUrl, loading, error } = useConfig();

  const handlemed = () => {
    router.push("/Medication"); 
    
  };
  
  
  return (
    <View style={{ flex: 1 }}>
            {/* Header Section */}
            <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}></Text>
        </TouchableOpacity>
      </View>
        

  

    <ScrollView style={styles.scrollView}>
    <Text style={styles.patientName}>Patient Name</Text>
      {/* Heart Rate Section */}
      <View style={styles.heartRateContainer}>
        <View style={styles.heartRateSection}>
          {/* Image 1 */}
          <Image
            source={require("@/assets/images/hearticon.png")} // Replace with your path to Image 1
            style={styles.heartIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.heartRateText}>72bpm</Text>
            <Text style={styles.heartRateLabel}>Heart Rate</Text>
          </View>
        </View>

        {/* Image 2 */}
        <Image
          source={require("@/assets/images/Heartrate.png")} // Replace with your path to Image 2
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
            <Text style={styles.statTitle}>Blood Count</Text>
            <Text style={styles.statValue}>80-90</Text>
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
            <Text style={styles.statValue}>92</Text>
            <Text style={styles.subValue}>
              <Text style={styles.pinkText}>▼1.5%</Text>
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
          width={Dimensions.get("window").width - 40} // Full-width chart
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

        {/* Stats Below the Bar Chart */}
        
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
     source={{uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} // Replace with your distance icon image path// Replace with your time icon image path
      style={styles.iconImage}
    />
    <Text style={styles.statDetailValue}>85h 24m</Text>
    <Text style={styles.statDetailLabel}>time</Text>
  </View>
  <View style={styles.statDetail}>
    <Image
       source={{uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} // Replace with your distance icon image path// Replace with your calorie icon image path
      style={styles.iconImage}
    />
    <Text style={styles.statDetailValue}>20,492</Text>
    <Text style={styles.statDetailLabel}>kcal</Text>
  </View>
  <View style={styles.statDetail}>
    <Image
      source={{
        uri:"https://w7.pngwing.com/pngs/345/54/png-transparent-green-location-icon-illustration-computer-icons-google-maps-google-map-maker-adress-angle-leaf-grass.png"}} // Replace with your distance icon image path
      style={styles.iconImage}
    />
    <Text style={styles.statDetailValue}>294.35</Text>
    <Text style={styles.statDetailLabel}>km</Text>
  </View>
</View>

      </View>
    </ScrollView>
     <NavBar />
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

export default DashboardHeartRateAndStats;
