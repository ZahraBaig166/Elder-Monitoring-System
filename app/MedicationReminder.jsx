import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Dimensions, TouchableOpacity
} from 'react-native';
import useConfig from "../hooks/useConfig";
import useAuth from '../hooks/useAuth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Calendar } from 'react-native-calendars'; // Add a calendar package for date selection

const { width } = Dimensions.get('window');

const MedicationReminder = () => {
  const { apiBaseUrl, loading, error } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const [medications, setMedications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); 

  const fetchMedications = async () => {
    console.log("Fetching medications for family:", user.userId);
    if (!user || !apiBaseUrl) return;

    try {
      const res = await fetch(`${apiBaseUrl}/family/getPatientMedications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ family_id: user.userId }),
      });

      const result = await res.json();
      console.log("Medications:", result);

      if (res.ok && result.success) {
        setMedications(result.data);
      } else {
        setMedications([]);
        Alert.alert('No medications found.');
      }
    } catch (err) {
      // console.error('Error fetching medications:', err);
      // Alert.alert('Error', 'Failed to load medications');
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [authLoading, loading, apiBaseUrl, user]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
  <Text style={styles.plusIcon}>💊</Text>
  <Text style={styles.headerText}>Medication Schedule</Text>
</View>

      {/* Calendar Component */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#ADC1D8', selectedTextColor: 'white' },
        }}
        style={styles.calendar}
      />
      <Text style={styles.selectedDate}>Schedule: {selectedDate}</Text>
      
      <ScrollView style={styles.medicationList} contentContainerStyle={styles.scrollContainer}>
        {medications.length > 0 ? (
          medications.map((med, index) => (
            <View key={index} style={styles.medicationCard}>
              <Text style={styles.medicationName}>{med.medication_name}</Text>
              <Text style={styles.requestType}>{med.type}</Text>
              <Text style={styles.label}>Next Dose</Text>
              <Text style={styles.value}>{new Date(med.next_dose_time).toLocaleString()}</Text>

              <Text style={styles.label}>Dosage</Text>
              <Text style={styles.value}>{med.dosage}</Text>

              <Text style={styles.label}>Interval</Text>
              <Text style={styles.value}>{med.interval}</Text>

              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{med.duration} days</Text>

              {/* View Details Button */}
              
            </View>
          ))
        ) : (
          <Text style={styles.noMedications}>No medications scheduled.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
  },
  headerContainer: {
    backgroundColor: '#B7C9DC', // match light blue
    paddingTop: hp('6%'),
    marginHorizontal: wp('-2%'),
    marginBottom: hp('2%'),
    paddingBottom: hp('4%'),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  plusIcon: {
    fontSize: wp('10%'),
    color: '#fff',
    marginBottom: hp('1%'),
  },
  headerText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  
  calendar: {
    marginBottom: hp('3%'),
   
  borderRadius: 20,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  selectedDate: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#34495e',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  medicationList: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: hp('5%'),
  },
  medicationCard: {
    backgroundColor: '#ADC1D8', // Soft blue background for the card
    padding: wp('5%'),
    borderRadius: 20, // Rounded corners for a smooth look
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: wp('3%'),
    flexDirection: 'column',
  },
  medicationName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#fff',
    
  },
  requestType: {
    fontSize: wp('4%'),
    color: '#fff',
    marginBottom: hp('1%'),
    fontStyle: 'italic',
  },
  label: {
    fontSize: wp('4%'),
    color: '#fff',
    marginTop: hp('0.8%'),
    fontWeight: '900',
  },
  value: {
    fontSize: wp('4.2%'),
    color: '#fff',
    marginBottom: hp('1.2%'),
  },
  noMedications: {
    fontSize: wp('4.5%'),
    color: '#888',
    alignSelf: 'center',
    marginTop: hp('10%'),
    fontStyle: 'italic',
  },
  viewDetailsButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: hp('1.5%'),
    alignItems: 'center',
    width: wp('40%'),
    alignSelf: 'center',
  },
  viewDetailsText: {
    fontSize: wp('4%'),
    color: '#333',
    fontWeight: '600',
  },
});

export default MedicationReminder;
