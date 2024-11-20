import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewUser = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>USERS</Text>
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
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search...." placeholderTextColor="#ADC1D8" />
        <Icon name="search" size={18} color="#ADC1D8" style={styles.searchIcon} />
      </View>
      <Text style={styles.allUsersText}>ALL USERS</Text>
      <ScrollView style={styles.userList}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.userCard}>
            <Image
              source={{ uri: 'https://placeholder.pics/svg/24x24' }}
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Name</Text>
              <Text style={styles.userContact}>Contact Number</Text>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <Icon name="phone" size={16} color="#000" style={styles.icon} />
              <Icon name="envelope" size={16} color="#000" style={styles.icon} />
            </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#ADC1D8',
  },
  searchIcon: {
    marginLeft: 10,
  },
  allUsersText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  userList: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  userContact: {
    fontSize: 8,
    fontWeight: '400',
    color: '#000',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  detailsButtonText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#263238',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#263238',
  },
  icon: {
    marginHorizontal: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default ViewUser;
