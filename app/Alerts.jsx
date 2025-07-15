import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const staticAlerts = [
  {
    patient_id: 'P1001',
    type: 'High Blood Pressure',
    is_acknowledged: false,
  },
  {
    patient_id: 'P1002',
    type: 'Low Oxygen Level',
    is_acknowledged: true,
  },
  {
    patient_id: 'P1003',
    type: 'Heart Rate Drop',
    is_acknowledged: false,
  },
];

const StaticAlerts = () => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp(5)} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}> ALERTS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp(5)} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {staticAlerts.map((alert, index) => (
            <View key={index} style={styles.queryCard}>
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
                    Acknowledged: {alert.is_acknowledged ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
});

export default StaticAlerts;
