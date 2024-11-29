import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddMedication = () => {
  const [patientName, setPatientName] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [interval, setInterval] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
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
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backButton: {
    padding: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#263238',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  addButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default AddMedication;