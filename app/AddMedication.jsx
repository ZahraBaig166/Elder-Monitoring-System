import React, { useState } from "react";
import {useEffect} from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";


const AddMedication = () => {
  const [patientName, setPatientName] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [interval, setInterval] = useState("");
  const [duration, setDuration] = useState("");
  const { apiBaseUrl, loading, error } = useConfig();


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={wp('5%')} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Medication</Text>

        {/* Patient's Name Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Patient's Name</Text>
          <TextInput
            style={styles.input}
            value={patientName}
            onChangeText={setPatientName}
            placeholder="Enter patient's name"
          />
        </View>

        {/* Medication Name Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={styles.input}
            value={medicationName}
            onChangeText={setMedicationName}
            placeholder="Enter medication name"
          />
        </View>

        {/* Dosage Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Enter dosage (e.g., 500mg)"
          />
        </View>

        {/* Interval Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interval</Text>
          <TextInput
            style={styles.input}
            value={interval}
            onChangeText={setInterval}
            placeholder="Enter interval (e.g., every 6 hours)"
          />
        </View>

        {/* Duration Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration (e.g., 7 days)"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: wp('2%'),
    marginBottom: hp('2%'),
  },
  headerText: {
    fontSize: wp('8%'),
    fontWeight: '700',
    color: '#263238',
    marginBottom: hp('2%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('4.5%'),
    fontWeight: '400',
    color: '#000',
    marginBottom: hp('1%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    backgroundColor: '#F9F9F9',
    fontSize: wp('4%'),
  },
  addButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: wp('8%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  addButtonText: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#FFF',
  },
});

export default AddMedication;
