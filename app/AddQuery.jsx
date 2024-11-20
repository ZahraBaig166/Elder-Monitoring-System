import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PhoneInput from 'react-native-phone-number-input';
import React, { useState, useRef } from "react";

const AddQueryComponent = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Icon name="plus-circle" size={40} color="#FFFFFF" style={styles.plusIcon} />
        <Text style={styles.headerText}>Add Query</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} placeholder="Enter the query subject" />
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
            disabled={false}
            disableArrowIcon={true}
            placeholder="Enter phone number"
            containerStyle={styles.phoneInputContainer}  // Use this only for styling the input container
            textContainerStyle={styles.textContainer}
            textInputProps={{ keyboardType: "phone-pad" }}
            textInputStyle={styles.textInput}
            codeTextStyle={styles.codeText}
            flagButtonStyle={styles.flagButton}
            countryPickerButtonStyle={styles.countryPickerButton}
            renderDropdownImage={<Icon name="arrow-down" size={18} color="#000" />}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your message here"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Icon name="home" size={24} color="#000" style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#000" style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bell" size={24} color="#000" style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="user" size={24} color="#000" style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: '32%'
  },
  plusIcon: {
    marginTop: 30,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#263238',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9F9F9',
  },
  textContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 100,
    backgroundColor: '#F9F9F9',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#263238',
  },
  submitButton: {
    backgroundColor: '#ADC1D8',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: "auto",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B1C4DA",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width:'100%'
  },textContainer:{
    flex: 1, marginLeft: 10, backgroundColor: "#f9f9f9", borderTopRightRadius:10, borderBottomRightRadius:10, borderLeftColor:'#B1C4DA', borderLeftWidth:1
  },
});

export default AddQueryComponent;
