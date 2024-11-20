import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NotificationComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={16} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ALERTS</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="ellipsis-v" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>DAILY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>WEEKLY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>MONTHLY</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notificationList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.notificationCard}>
            <Image
              source={{ uri: 'https://placeholder.pics/svg/40x44' }}
              style={styles.notificationIcon}
            />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationText}>
                [Resident's Name] is experiencing elevated heart rate. Immediate check recommended.
              </Text>
              <Text style={styles.notificationTime}>About 1 minute ago</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Icon name="home" size={24} color="#000" />
        <Icon name="bell" size={24} color="#000" />
        <Icon name="envelope" size={24} color="#000" />
        <Icon name="user" size={24} color="#000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1617',
  },
  menuButton: {
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  notificationList: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  notificationIcon: {
    width: 40,
    height: 44,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#1D1617',
  },
  notificationTime: {
    fontSize: 10,
    fontWeight: '400',
    color: '#7B6F72',
  },
  viewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#263238',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default NotificationComponent;
