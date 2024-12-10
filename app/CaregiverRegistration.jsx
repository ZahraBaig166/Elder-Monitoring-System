import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";


const CaregiverRegistration = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [educations, setEducations] = useState([{ id: 1, degree: '' }]);


  // Add education field
  const addEducationField = () => {
    setEducations([...educations, { id: educations.length + 1, degree: '' }]);
  };

  const handleEducationChange = (text, id) => {
    const updatedEducations = educations.map((edu) =>
      edu.id === id ? { ...edu, degree: text } : edu
    );
    setEducations(updatedEducations);
  };

  const handleSubmit = async () => {
    // Create an object to send to the backend
    const caregiverData = {
      name,
      email,
      age,
      address,
      educations,
    };
    console.log("caregiver data,",caregiverData);

    try {
      const response = await fetch('http://10.135.53.147:3000/submit/caregiver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caregiverData),
      });

       // Get the raw response text
       const responseText = await response.text();  // Get plain text response
       console.log("Response Text: ", responseText);  // Log raw response text
   
       if (response.ok) {
         // Since the response is plain text, we don't need to parse it as JSON
         alert(responseText);  // Display plain text response
         router.push("/");
       } else {
         alert('Error registering caregiver: ' + responseText || 'Unknown error');
       }
     } catch (error) {
       console.error('Error submitting form:', error);
       alert('Error submitting the form');
     }
   };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Caregiver Registration</Text>
        
        {/* Caregiver Info Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />
        </View>
        
        {/* Education Section */}
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

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
