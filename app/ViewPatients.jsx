import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewPatients = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Patients List</Text>
        <View style={styles.headerIcons}>
          <Icon name="user" size={20} color="#FFF" />
          <Text style={styles.doctorText}>DOCTOR</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search...." placeholderTextColor="#ADC1D8" />
        <Icon name="search" size={18} color="#ADC1D8" style={styles.searchIcon} />
      </View>
      <ScrollView style={styles.patientList}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.patientCard}>
            <Image
              source={{ uri: 'https://placeholder.pics/svg/39x38' }}
              style={styles.patientImage}
            />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Patient Name</Text>
              <Text style={styles.patientCondition}>heart patient</Text>
            </View>
            <View style={styles.patientActions}>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Details</Text>
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
  },
  header: {
    backgroundColor: '#ADC1D8',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#ADC1D8',
  },
  searchIcon: {
    marginLeft: 10,
  },
  patientList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  patientImage: {
    width: 39,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  patientCondition: {
    fontSize: 8,
    fontWeight: '400',
    color: '#000',
  },
  patientActions: {
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

export default ViewPatients;
