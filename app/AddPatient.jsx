import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from "react-native-phone-number-input";

const AddPatient = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Patient</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>DOB:</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Medical Condition:</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Reports:</Text>
          <View style={styles.uploadSection}>
            <Icon name="upload" size={24} color="#8E8E8E" />
            <Text style={styles.uploadText}>Upload Additional File</Text>
          </View>
        </View>
        <Text style={styles.familyInfoText}>Family Information:</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Guardian Name:</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number:</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="PK"
            layout="second"
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => setFormattedValue(text)}
            disabled={false}
            disableArrowIcon={true}
            placeholder="Enter phone number"
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.textContainer}
            textInputProps={{ keyboardType: 'phone-pad' }}
            textInputStyle={styles.textInput}
            codeTextStyle={styles.codeText}
            flagButtonStyle={styles.flagButton}
            countryPickerButtonStyle={styles.countryPickerButton}
            onChangeCountry={(country) => {}}
            renderDropdownImage={<Icon name="arrow-down" size={18} color="#000" />}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address:</Text>
          <TextInput style={styles.input} />
        </View>
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
  familyInfoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
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
  phoneInputContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#F9F9F9',
    borderWidth: 0.5,
    borderLeftColor: '#E0E0E0',
    borderRightColor: '#fff',
    borderTopColor: '#fff',
    borderBottomColor: '#fff',
  },
  textInput: {
    fontSize: 16,
    padding: 2,
    color: '#333',
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  flagButton: {
    padding: 2,
  },
  countryPickerButton: {
    padding: 2,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
});

export default AddPatient;
