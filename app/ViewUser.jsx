import React from 'react';
import {useEffect} from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import NavBar from '../components/NavBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";


const ViewUser = () => {

  const { apiBaseUrl, loading, error } = useConfig();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp('5%')} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>USERS</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-v" size={wp('5%')} color="#000" />
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
          <Icon name="search" size={wp('4%')} style={styles.searchIcon} />
        </View>

        {/* All Users Section */}
        <View style={styles.usersContainer}>
          <View style={styles.usersHeader}>
            <Text style={styles.allUsersText}>ALL USERS</Text>
            <TouchableOpacity>
              <Icon name="filter" size={wp('5%')} color="#000" style={styles.filterIcon} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={styles.userCard}>
                {/* User Info Section */}
                <View style={styles.userInfo}>
                  <Image
                    source={{
                      uri: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
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
                  <Icon name="heart" size={wp('4%')} color="#F28F8F" style={styles.icon} />
                  <Icon name="phone" size={wp('4%')} color="#000" style={styles.icon} />
                  <Icon name="envelope" size={wp('4%')} color="#000" style={styles.icon} />
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
    paddingTop: hp('4%'),
  },
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  headerText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#1D1617',
  },
  menuButton: {
    padding: wp('2%'),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('2%'),
  },
  filterButton: {
    borderWidth: wp('0.4%'),
    borderColor: '#ADC1D8',
    borderRadius: wp('5%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#FFFFFF',
    width: wp('25%'),
  },
  activeFilter: {
    backgroundColor: '#ADC1D8',
    borderColor: '#ADC1D8',
  },
  filterText: {
    fontSize: wp('3%'),
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
    borderRadius: wp('10%'),
    paddingHorizontal: wp('4%'),
    height: hp('6%'),
    marginBottom: hp('3%'),
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: '#ADC1D8',
  },
  searchIcon: {
    marginLeft: wp('2%'),
    color: '#ADC1D8',
  },
  usersContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    elevation: 4,
  },
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  allUsersText: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#000',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
  },
  userName: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp('1%'),
  },
  userContact: {
    fontSize: wp('3%'),
    fontWeight: '400',
    color: '#333',
    marginBottom: hp('1%'),
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsButton: {
    backgroundColor: '#FFF',
    borderRadius: wp('2%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    marginRight: wp('1%'),
  },
  detailsButtonText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#FFF',
    borderRadius: wp('2%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
  },
  editButtonText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#E04F4F',
    borderRadius: wp('2%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    marginLeft: wp('2%'),
  },
  deleteButtonText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    color: '#FFFFFF',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: wp('3%'),
  },
});

export default ViewUser;
