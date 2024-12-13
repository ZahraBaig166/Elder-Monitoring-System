import React, { useState, useRef } from "react";
import {useEffect} from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-number-input";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";


const EditUser = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const { apiBaseUrl, loading, error } = useConfig();

  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={wp("5%")} color="#FFF" />
          </TouchableOpacity>
          <Icon name="pencil" size={wp("7%")} color="#FFF" style={styles.editIcon} />
          <Text style={styles.headerText}>Edit User</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Icon name="user" size={wp("12%")} color="#4a4a4a" style={styles.profileImage} />
            <View style={styles.textSection}>
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              <View style={styles.uploadSection}>
                <Icon name="upload" size={wp("6%")} color="#4a4a4a" />
                <Text style={styles.uploadText}>Update Profile pic</Text>
              </View>
              <Text style={styles.helperText}>
                Attach file. File size of your documents should not exceed 10MB
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Icon name="user" size={wp("6%")} color="#4a4a4a" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User Name</Text>
              <TextInput style={styles.input} placeholder="Enter User Name" placeholderTextColor="#D3D3D3" />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Icon name="phone" size={wp("6%")} color="#4a4a4a" style={styles.inputIcon2} />
            <View style={[styles.inputContainer, { marginTop: hp("2%") }]}>
              <Text style={styles.label2}>Phone Number</Text>
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
                textInputProps={{
                  keyboardType: "phone-pad",
                  placeholderTextColor: "#D3D3D3",
                }}
                textInputStyle={styles.textInput}
                codeTextStyle={styles.codeText}
                flagButtonStyle={styles.flagButton}
                countryPickerButtonStyle={styles.countryPickerButton}
                renderDropdownImage={<Icon name="arrow-down" size={wp("4%")} color="#000" />}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Icon name="envelope" size={wp("6%")} color="#4a4a4a" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="Enter Email Address" placeholderTextColor="#D3D3D3" />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Icon name="home" size={wp("6%")} color="#000" />
          <Icon name="bell" size={wp("6%")} color="#000" />
          <Icon name="plus" size={wp("6%")} color="#000" />
          <Icon name="user" size={wp("6%")} color="#000" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFF" },
  header: {
    backgroundColor: "#B1C4DA",
    paddingVertical: hp("5%"),
    alignItems: "center",
    borderBottomLeftRadius: wp("8%"),
    borderBottomRightRadius: wp("8%"),
    height: hp("25%"),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: { position: "absolute", left: wp("5%"), top: hp("3%") },
  editIcon: { marginBottom: hp("1%"), marginTop: hp("7%") },
  headerText: {
    marginTop: hp("1%"),
    fontSize: wp("6%"),
    fontWeight: "700",
    color: "#FFF",
  },
  profileSection: {
    alignItems: "center",
    padding: wp("5%"),
  },
  profileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" },
  profileImage: { width: wp("12%"), height: wp("12%"), borderRadius: wp("6%") },
  uploadPhotoText: { fontSize: wp("4%"), fontWeight: "600", color: "#333", marginBottom: hp("1%") },
  uploadSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B1C4DA",
    padding: wp("3%"),
    borderRadius: wp("3%"),
    marginBottom: hp("1%"),
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  uploadText: { fontSize: wp("3%"), color: "#555", marginLeft: wp("2%") },
  helperText: { fontSize: wp("3%"), color: "#888", textAlign: "center" },
  inputSection: { paddingHorizontal: wp("5%") },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("2%") },
  inputIcon: { marginRight: wp("3%"), height: wp("6%"), width: wp("6%") },
  inputIcon2: { marginRight: wp("3%"), height: wp("6%"), width: wp("6%") },
  inputContainer: { flex: 1 },
  label: { fontSize: wp("4%"), fontWeight: "600", color: "#555", marginVertical: hp("0.5%") },
  input: {
    borderWidth: 1,
    borderColor: "#B1C4DA",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    fontSize: wp("4%"),
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B1C4DA",
    borderRadius: wp("2%"),
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: hp("1%"),
  },
  doneButton: {
    backgroundColor: "#B1C4DA",
    borderRadius: wp("8%"),
    paddingVertical: hp("2%"),
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    alignItems: "center",
    alignSelf: "center",
    width: wp("50%"),
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  doneButtonText: { fontSize: wp("4.5%"), fontWeight: "600", color: "#FFF" },
});

export default EditUser;
