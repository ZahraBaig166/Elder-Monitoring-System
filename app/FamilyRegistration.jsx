import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from "react-native-phone-number-input";
import { useRouter } from "expo-router";


const FamilyRegistration = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const phoneInput = useRef(null);
  
  const handleSubmit = async () => {

    const familyData = {
      name,
      email,
      relationship,
      phone,
      address,
      patient: {
        name: patientName,
        age: patientAge,
        medicalCondition,
        status: patientStatus,
        emergencyContact,
      },
    };
  
    try {
      console.log(familyData);
      const response = await fetch('http://10.135.53.147:3000/submit/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(familyData),
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
        <Text style={styles.headerText}>Family Registration</Text>
        
        {/* Caregiver Information */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Relationship to Patient:</Text>
          <TextInput style={styles.input} value={relationship} onChangeText={setRelationship} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="PK"
            layout="second"
            onChangeText={setPhone}
            onChangeFormattedText={setPhone}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.textContainer}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address:</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />
        </View>

        <Text style={styles.patientSectionText}>Add a Patient:</Text>
        
        {/* Patient Information */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Patient Name:</Text>
          <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age:</Text>
          <TextInput style={styles.input} value={patientAge} onChangeText={setPatientAge} keyboardType="numeric" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Medical Condition:</Text>
          <TextInput style={styles.input} value={medicalCondition} onChangeText={setMedicalCondition} multiline />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Patient Status:</Text>
          <TextInput style={styles.input} value={patientStatus} onChangeText={setPatientStatus} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Emergency Contact:</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={emergencyContact}
            defaultCode="PK"
            layout="second"
            onChangeText={setEmergencyContact}
            onChangeFormattedText={setEmergencyContact}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.textContainer}
          />
        </View>

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
  uploadContainer: {
    marginBottom: 20,
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8E8E8E',
    padding: 10,
    borderRadius: 10,
  },
  uploadText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },
  patientSectionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  textContainer: {
    backgroundColor: '#F9F9F9',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#ADC1D8',
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

export default FamilyRegistration;
