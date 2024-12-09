import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CaregiverRegistration = () => {
  const [educations, setEducations] = useState([{ id: 1, degree: '' }]);

  const addEducationField = () => {
    setEducations([...educations, { id: educations.length + 1, degree: '' }]);
  };

  const handleEducationChange = (text, id) => {
    const updatedEducations = educations.map((edu) =>
      edu.id === id ? { ...edu, degree: text } : edu
    );
    setEducations(updatedEducations);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Caregiver Registration</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} keyboardType="email-address" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} keyboardType="numeric" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} multiline />
        </View>
        <View style={styles.educationContainer}>
          <Text style={styles.label}>Education</Text>
          {educations.map((edu) => (
            <View key={edu.id} style={styles.educationField}>
              <TextInput
                style={styles.input}
                placeholder={`Degree ${edu.id}`}
                value={edu.degree}
                onChangeText={(text) => handleEducationChange(text, edu.id)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addEducationField}>
            <Icon name="plus" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Another</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>REGISTER</Text>
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
  educationContainer: {
    marginBottom: 20,
  },
  educationField: {
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ADC1D8',
    borderRadius: 30,
    paddingVertical: 10,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default CaregiverRegistration;
