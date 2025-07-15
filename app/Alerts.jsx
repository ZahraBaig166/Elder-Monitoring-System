import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";

const Alerts = () => {
  const { apiBaseUrl } = useConfig();
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/alerts`);
        const data = await response.json();
        setAlerts(data); // Update state with fetched alerts
      } catch (error) {
        // console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [apiBaseUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>ALERTS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        {/* List of Alerts */}
        <ScrollView>
          {alerts.map((alert, index) => (
            <View key={index} style={styles.queryCard}>
              {/* User Info Section */}
              <View style={styles.queryInfo}>
                <Image
                  source={{
                    uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
                  }}
                  style={styles.userImage}
                />
                <View style={styles.queryDetails}>
                  <Text style={styles.userName}>Patient ID: {alert.patient_id}</Text>
                  <Text style={styles.querySubject}>Type: {alert.type}</Text>
                  <Text style={styles.queryDescription}>
                    Acknowledged: {alert.is_acknowledged ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* <NavBar /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  backButton: {
    padding: wp(2.5),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#1D1617',
  },
  menuButton: {
    padding: wp(2.5),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2),
  },
  filterButton: {
    borderWidth: wp(0.4),
    borderColor: '#ADC1D8',
    borderRadius: wp(5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: '#FFFFFF',
    width: wp(25),
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
    borderColor: '#ADC1D8',
  },
  filterText: {
    fontSize: wp(3),
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: wp(8),
    paddingHorizontal: wp(4),
    height: hp(6),
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: wp(3.5),
    color: '#ADC1D8',
    paddingVertical: hp(0.5),
  },
  searchIcon: {
    marginLeft: wp(2),
    color: '#ADC1D8',
  },
  queriesContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: wp(5),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    elevation: 4,
  },
  queriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  allQueriesText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#000',
  },
  filterIcon: {
    padding: wp(2.5),
  },
  queryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
  },
  queryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
  },
  queryDetails: {
    flex: 1,
  },
  userName: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(0.5),
  },
  querySubject: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#406B9E',
    marginBottom: hp(0.5),
  },
  queryDescription: {
    fontSize: wp(3.5),
    color: '#333',
  },
  respondButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.4,
    shadowRadius: wp(2),
  },
  respondButtonText: {
    fontSize: wp(3.5),
    fontWeight: '600',
    color: '#000',
  },
});

export default Alerts;