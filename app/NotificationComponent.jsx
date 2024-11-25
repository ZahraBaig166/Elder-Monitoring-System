import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar';

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ALERTS</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-v" size={20} color="#000" />
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 50, // Ensure proper spacing at the top
    paddingBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 15,
  },
  filterButton: {
    borderWidth: 1.5,
    borderColor: '#ADC1D8',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  activeFilterText: {
    color: '#000',
  },
  notificationsContainer: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7E8C99',
  },
  viewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#406B9E',
  },
});

export default NotificationScreen;
