import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Queries = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>QUERIES</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="ellipsis-v" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>FAMILY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>CAREGIVER</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.allQueriesText}>ALL QUERIES</Text>
      <ScrollView style={styles.queryList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.queryCard}>
            <Image
              source={{ uri: 'https://placeholder.pics/svg/42x40' }}
              style={styles.userImage}
            />
            <View style={styles.queryInfo}>
              <Text style={styles.userName}>Name</Text>
              <Text style={styles.subjectText}>SUBJECT - Device Connectivity</Text>
              <Text style={styles.queryText}>
                The wearable device isn’t syncing data with the system. Can you help troubleshoot connectivity issues?
              </Text>
            </View>
            <TouchableOpacity style={styles.respondButton}>
              <Text style={styles.respondButtonText}>RESPOND</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Icon name="home" size={24} color="#000" />
        <Icon name="bell" size={24} color="#000" />
        <Icon name="plus" size={24} color="#000" />
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
  allQueriesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  queryList: {
    flex: 1,
  },
  queryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  userImage: {
    width: 42,
    height: 40,
    borderRadius: 21,
    marginRight: 10,
  },
  queryInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  subjectText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#406B9E',
  },
  queryText: {
    fontSize: 7,
    fontWeight: '400',
    color: '#000',
  },
  respondButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  respondButtonText: {
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

export default Queries;
