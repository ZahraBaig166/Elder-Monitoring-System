import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useRef } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import useConfig from "../hooks/useConfig";
import RNPickerSelect from 'react-native-picker-select'; 

const AddQueryComponent = () => {
  const [subject, setSubject] = useState("");  
  const [phone, setPhone] = useState("");  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userchoice, setUserchoice] = useState('');  // Default value for family type selection
  const phoneInput = useRef(null);
  const router = useRouter();
  const { apiBaseUrl } = useConfig();
  const { userId, type } = useLocalSearchParams();

  const handleSubmit = async () => {
    if (!subject || !phone || !message) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/add-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Include userId from query params
          subject,
          recepient: type === 'family' ? userchoice : 'admin',  // Set recipient based on the condition
          phone,
          message,
          type
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert('Query submitted successfully');
        router.replace('/DoctorDashboard'); // Navigate to a success page
      } else {
        alert('Failed to submit query');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="plus-circle" size={30} color="#FFFFFF" style={styles.plusIcon} />
        <Text style={styles.headerText}>Add Query</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the query subject"
            placeholderTextColor="#D3D3D3"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="PK"
            layout="second"
            onChangeText={(text) => setPhone(text)}
            onChangeFormattedText={(text) => setPhone(text)}
            placeholder="Enter phone number"
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.textContainer}
            textInputStyle={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your message here"
            placeholderTextColor="#D3D3D3"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Conditional Dropdown for Family type */}
        {type === 'family' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Recipient</Text>
            <RNPickerSelect
  onValueChange={(value) => setUserchoice(value)}
  items={[
    { label: 'Admin', value: 'admin' },
    { label: 'Caregiver', value: 'caregiver' }
  ]}
  placeholder={{ label: "Select a recipient...", value: 'admin' }}
  style={{
    inputAndroid: {
      ...styles.input,
      paddingRight: 30, // Ensure space for the icon
    },
    inputIOS: {
      ...styles.input,
      paddingRight: 30, // Ensure space for the icon
    },
    placeholder: { color: '#D3D3D3' },
    iconContainer: {
      top: 10,
      right: 12, // Adjust position of the icon
    },
  }}
  Icon={() => <Icon name="caret-down" size={20} color="#B0C4DE" />}
  useNativeAndroidPickerStyle={false}
/>

          </View>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 100,
  },
  plusIcon: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#263238',
  },
  
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textContainer: {
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    height: 120,
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#263238',
  },
  submitButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AddQueryComponent;
