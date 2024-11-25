import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import NavBar from '../components/NavBar';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewUser = () => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>USERS</Text>
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
        placeholderTextColor="#ADC1D8" // Matches the design
      />
      <Icon name="search" size={18} style={styles.searchIcon} />
    </View>

      {/* All Users Section */}
      <View style={styles.usersContainer}>
        <View style={styles.usersHeader}>
          <Text style={styles.allUsersText}>ALL USERS</Text>
          <TouchableOpacity>
            <Icon name="filter" size={20} color="#000" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.userCard}>
              {/* User Info Section */}
              <View style={styles.userInfo}>
                <Image
                  source={{
                    uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg', // Dummy user image
                  }}
                  style={styles.userImage}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>Name</Text>
                  <Text style={styles.userContact}>Contact Number</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.detailsButton}>
                      <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Action Icons */}
              <View style={styles.userActions}>
                <Icon name="heart" size={16} color="#F28F8F" style={styles.icon} />
                <Icon name="phone" size={16} color="#000" style={styles.icon} />
                <Icon name="envelope" size={16} color="#000" style={styles.icon} />
              </View>
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
     paddingTop: 35,
    // marginTop:20,
  },
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    // marginTop:20,
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
  
  usersContainer: {
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
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allUsersText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  filterIcon: {
    padding: 10,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  userContact: {
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  detailsButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#E04F4F',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
     marginLeft: 10,
    
  },
  deleteButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
  },
});

export default ViewUser;
