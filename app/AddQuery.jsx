import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useRef } from "react";
import {useEffect} from "react";
import useConfig from "../backend/../hooks/useConfig";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AddQueryComponent = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const { apiBaseUrl, loading, error } = useConfig();

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="plus-circle" size={hp('6%')} color="#FFFFFF" style={styles.plusIcon} />
        <Text style={styles.headerText}>Add Query</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} placeholder="Enter the query subject" placeholderTextColor="#D3D3D3" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="PK"
            layout="second"
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => setFormattedValue(text)}
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
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
    paddingVertical: hp('4%'),
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    height: hp('25%'),
  },
  plusIcon: {
    marginBottom: hp('1%'),
  },
  headerText: {
    fontSize: hp('3%'),
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: hp('2%'),
    fontWeight: '600',
    color: '#263238',
    marginBottom: hp('1%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#F9F9F9',
    fontSize: hp('2%'),
    color: '#263238',
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: wp('2%'),
    backgroundColor: '#F9F9F9',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  textContainer: {
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    fontSize: hp('2%'),
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    height: hp('15%'),
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
    fontSize: hp('2%'),
    color: '#263238',
  },
  submitButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: wp('6%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginHorizontal: wp('5%'),
    marginTop: hp('3%'),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: hp('2.5%'),
    fontWeight: '700',
  },
});

export default AddQueryComponent;
