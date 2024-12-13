import React, { useState, useRef } from "react";
import {useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from "react-native-phone-number-input";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";

const AddPatient = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const { apiBaseUrl, loading, error } = useConfig();


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={wp('6%')} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Patient</Text>
        {['First Name', 'Last Name', 'DOB:', 'Medical Condition:'].map((label, index) => (
          <View style={styles.inputContainer} key={index}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} />
          </View>
        ))}

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Reports:</Text>
          <View style={styles.uploadSection}>
            <Icon name="upload" size={wp('6%')} color="#8E8E8E" />
            <Text style={styles.uploadText}>Upload Additional File</Text>
          </View>
        </View>

        <Text style={styles.familyInfoText}>Family Information:</Text>
        {['Guardian Name:', 'Address:'].map((label, index) => (
          <View style={styles.inputContainer} key={index}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input} />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number:</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="PK"
            layout="second"
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => setFormattedValue(text)}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.textContainer}
            textInputProps={{ keyboardType: 'phone-pad' }}
            textInputStyle={styles.textInput}
            codeTextStyle={styles.codeText}
            flagButtonStyle={styles.flagButton}
            countryPickerButtonStyle={styles.countryPickerButton}
            renderDropdownImage={<Icon name="arrow-down" size={wp('4%')} color="#000" />}
          />
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
  },
  uploadContainer: {
    marginBottom: hp('2%'),
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8E8E8E',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  uploadText: {
    fontSize: wp('4%'),
    color: '#000',
    marginLeft: wp('3%'),
  },
  familyInfoText: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp('1.5%'),
  },
  addButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: wp('10%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  addButtonText: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#FFF',
  },
  phoneInputContainer: {
    paddingHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: wp('2%'),
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginLeft: wp('2%'),
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    fontSize: wp('4%'),
    color: '#333',
    flex: 1,
  },
  codeText: {
    fontSize: wp('4%'),
  },
  flagButton: {
    padding: wp('1%'),
  },
  countryPickerButton: {
    padding: wp('1%'),
    backgroundColor: '#F9F9F9',
    borderRadius: wp('2%'),
  },
});

export default AddPatient;
