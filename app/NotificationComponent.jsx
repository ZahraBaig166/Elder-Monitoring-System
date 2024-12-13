import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useEffect} from "react";

import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import useConfig from "../backend/../hooks/useConfig";


const NotificationScreen = () => {
  const { apiBaseUrl, loading, error } = useConfig();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={wp(5)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ALERTS</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-v" size={wp(5)} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>DAILY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={[styles.filterText, styles.activeFilterText]}>
            WEEKLY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>MONTHLY</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <ScrollView style={styles.notificationsContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.notificationCard}>
            <View style={styles.notificationContent}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/4226/4226663.png',
                }}
                style={styles.imagePlaceholder}
              />
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>
                  [Resident's Name] is experiencing elevated heart rate.
                  Immediate check recommended.
                </Text>
                <Text style={styles.notificationTime}>About 1 minute ago</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* NavBar */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderBottomLeftRadius: wp(8),
    borderBottomRightRadius: wp(8),
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  backButton: {
    padding: wp(2),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  filterButton: {
    borderWidth: wp(0.4),
    borderColor: '#ADC1D8',
    borderRadius: wp(5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
  },
  filterText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#000',
  },
  activeFilterText: {
    color: '#000',
  },
  notificationsContainer: {
    flex: 1,
    padding: wp(5),
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePlaceholder: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#FFFFFF',
    marginRight: wp(3),
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#000',
    marginBottom: hp(0.5),
  },
  notificationTime: {
    fontSize: wp(3),
    color: '#7E8C99',
  },
  viewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    shadowOffset: { width: 0, height: hp(0.2) },
    shadowOpacity: 0.4,
    shadowRadius: wp(2),
  },
  viewButtonText: {
    fontSize: wp(3.5),
    fontWeight: '600',
    color: '#406B9E',
  },
});

export default NotificationScreen;
