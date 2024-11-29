import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { FontAwesome } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

LocaleConfig.locales['en'] = {
  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: "Today",
};

LocaleConfig.defaultLocale = 'en';

const MedicationReminder = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({
    '2024-11-29': { selected: true, marked: true, selectedColor: 'blue', selectedTextColor: 'white' },
    '2024-12-01': { marked: true, dotColor: 'red' },
    '2024-12-05': { marked: true, dotColor: 'green' },
  });

  const [medications] = useState([
    { name: 'Aspirin', time: '8:00 AM' },
    { name: 'Insulin', time: '9:00 AM' },
    { name: 'Med1', time: '12:00 PM' },
    { name: 'Vitamin C', time: '6:00 PM' },
  ]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    Alert.alert('Selected Date', `You selected: ${day.dateString}`);
  };
  const router = useRouter();  // Initialize useRouter
  const handleaddmedication = () => {
    router.push('/AddMedication');  // Toggle the state
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medication Reminder</Text>
        <Text style={styles.dateText}>{selectedDate ? selectedDate : 'Select a date'}</Text>
      </View>

      {/* Calendar Component */}
      <Calendar
        current={'2024-11-29'}
        minDate={'2024-01-01'}
        maxDate={'2024-12-31'}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        monthFormat={'yyyy MM'}
        hideExtraDays={true}
        markingType={'simple'}
      />

      {/* Medication List */}
      <ScrollView style={styles.medicationList}>
        {medications.map((medication, index) => (
          <View key={index} style={styles.medicationCard}>
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationTime}>{medication.time}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Mark as Done</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Remind Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleaddmedication} style={styles.footerButton}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Add Medication</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#B1C4DA',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    paddingTop: 40,
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  medicationList: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationInfo: {
    flex: 2,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#B1C4DA',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#B1C4DA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: width * 0.8,
    justifyContent: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default MedicationReminder;
