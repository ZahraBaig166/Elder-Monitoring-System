import React, { useState, useRef } from "react";
import {useEffect} from "react";

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-number-input";
import NavBar from '../components/NavBarPatients';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";


const AddUser = () => {
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
            <Icon name="arrow-left" size={wp("5%") } color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add User</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Icon name="user" size={wp("12%") } color="#4A4A4A" style={styles.profileImage} />
            <View style={styles.textSection}>
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              <View style={styles.uploadSection}>
                <Icon name="upload" size={wp("6%") } color="#4A4A4A" />
                <Text style={styles.uploadText}>Upload Profile pic</Text>
              </View>
              <Text style={styles.helperText}>
                Attach file. File size of your documents should not exceed 10MB
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <Icon name="user" size={wp("6%") } color="#4A4A4A" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User Name</Text>
              <TextInput style={styles.input} placeholder="Enter User Name" placeholderTextColor="#D3D3D3" />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Icon name="phone" size={wp("6%") } color="#4A4A4A" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode="PK"
                layout="second"
                onChangeText={(text) => setValue(text)}
                placeholder="Enter phone number"
                containerStyle={styles.phoneInputContainer}
                textContainerStyle={styles.textContainer}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <Icon name="envelope" size={wp("6%") } color="#4A4A4A" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="Enter Email Address" placeholderTextColor="#D3D3D3" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <NavBar />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingVertical: hp("2%") },
  header: {
    paddingVertical: hp("6%"),
    alignItems: "center",
    borderBottomRightRadius: wp("8%"),
    elevation: 5,
  },
  backButton: { position: "absolute", left: wp("5%"), top: hp("4%") },
  headerText: { fontSize: wp("8%"), fontWeight: "700", color: "#000" },
  profileSection: { alignItems: "center", padding: hp("3%") },
  profileRow: { flexDirection: "row", alignItems: "center", width: "90%" },
  uploadPhotoText: { fontSize: wp("4%"), fontWeight: "600", color: "#333", marginBottom: hp("1%") },
  uploadSection: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#B1C4DA",
    padding: hp("1.5%"), borderRadius: wp("3%"),
    backgroundColor: "#FFF", elevation: 3,
  },
  uploadText: { fontSize: wp("4%"), color: "#555", marginLeft: wp("2%") },
  helperText: { fontSize: wp("3%"), color: "#888" },
  inputSection: { paddingHorizontal: wp("5%") },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("2.5%") },
  inputIcon: { marginRight: wp("4%") },
  inputContainer: { flex: 1 },
  label: { fontSize: wp("4%"), fontWeight: "600", color: "#555", marginBottom: hp("0.5%") },
  input: {
    borderWidth: 1, borderColor: "#B1C4DA", borderRadius: wp("3%"),
    padding: hp("1.5%"), fontSize: wp("4%"), backgroundColor: "#FFF",
    elevation: 2, width: "100%"
  },
  phoneInputContainer: {
    borderWidth: 1, borderColor: "#B1C4DA", borderRadius: wp("3%"),
    backgroundColor: "#FFF", elevation: 2, width: "100%",
  },
  textContainer: {
    backgroundColor: "#FFF",
  },
  doneButton: {
    backgroundColor: "#B1C4DA", borderRadius: wp("8%"),
    paddingVertical: hp("2%"), alignItems: "center",
    alignSelf: "center", width: wp("50%"), elevation: 5
  },
  doneButtonText: { fontSize: wp("5%"), fontWeight: "600", color: "#FFF" },
});

export default AddUser;
