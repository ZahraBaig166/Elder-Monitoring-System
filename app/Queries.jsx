import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar'; 

const QueriesPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>QUERIES</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>FAMILY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>CAREGIVER</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search...."
            placeholderTextColor="#ADC1D8"
          />
          <Icon name="search" size={18} style={styles.searchIcon} />
        </View>

        {/* All Queries Section */}
        <View style={styles.queriesContainer}>
          <View style={styles.queriesHeader}>
            <Text style={styles.allQueriesText}>ALL QUERIES</Text>
            <TouchableOpacity>
              <Icon name="filter" size={20} color="#000" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {Array.from({ length: 7 }).map((_, index) => (
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
                    <Text style={styles.userName}>Name</Text>
                    <Text style={styles.querySubject}>SUBJECT - Device Connectivity</Text>
                    <Text style={styles.queryDescription}>
                      The wearable device isn’t syncing data with the system. Can you help troubleshoot connectivity issues?
                    </Text>
                  </View>
                </View>

                {/* Respond Button */}
                <TouchableOpacity style={styles.respondButton}>
                  <Text style={styles.respondButtonText}>Respond</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <NavBar />
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
    paddingHorizontal: 20,
    paddingTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1617',
  },
  menuButton: {
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    borderWidth: 1.5,
    borderColor: '#ADC1D8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '30%',
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
    borderColor: '#ADC1D8',
  },
  filterText: {
    fontSize: 12,
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
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ADC1D8',
    paddingVertical: 5,
  },
  searchIcon: {
    marginLeft: 10,
    color: '#ADC1D8',
  },
  queriesContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  queriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  allQueriesText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  filterIcon: {
    padding: 10,
  },
  queryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  queryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 60,
  },
  queryDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  querySubject: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D1617',
    marginBottom: 5,
  },
  queryDescription: {
    fontSize: 12,
    color: '#333',
  },
  // respondButton: {
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 10,
  //   paddingVertical: 8,
  //   paddingHorizontal: 20,
  //   marginLeft: 10, 
  //   marginRight: -10,
  //   shadowColor: '#000', 
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 2, 
  // },
  // respondButtonText: {
  //   fontSize: 12,
  //   fontWeight: '600',
  //   color: '#000',
  // },
  respondButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  respondButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  querySubject: {
    fontSize: 12,
    fontWeight: '700',
    color: '#406B9E', 
    marginBottom: 5,
  },
});

export default QueriesPage;
