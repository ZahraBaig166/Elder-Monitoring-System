import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-number-input";

const AddUser = () => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
          <Icon name="plus" size={30} color="#FFF" style={styles.addIcon} />
          <Text style={styles.headerText}>Add User</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Icon name="user" size={50} color="#000" style={styles.profileImage} />
            <View style={styles.textSection}>
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              <View style={styles.uploadSection}>
                <Icon name="upload" size={24} color="#8E8E8E" />
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
            <Icon name="user" size={24} color="#000" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User Name</Text>
              <TextInput style={styles.input} placeholder="Enter User Name" />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Icon name="phone" size={24} color="#000" style={styles.inputIcon2} />
            <View style={[styles.inputContainer, { marginTop: 15 }]}>
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
                textInputProps={{ keyboardType: "phone-pad" }}
                textInputStyle={styles.textInput}
                codeTextStyle={styles.codeText}
                flagButtonStyle={styles.flagButton}
                countryPickerButtonStyle={styles.countryPickerButton}
                renderDropdownImage={<Icon name="arrow-down" size={18} color="#000" />}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <Icon name="envelope" size={24} color="#000" style={styles.inputIcon} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="Enter Email Address" />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Icon name="home" size={24} color="#000" />
          <Icon name="bell" size={24} color="#000" />
          <Icon name="plus" size={24} color="#000" />
          <Icon name="user" size={24} color="#000" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFF" },
  header: {
    backgroundColor: "#B1C4DA",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: { position: "absolute", left: 20, top: 20 },
  addIcon: { marginBottom: 5, marginTop: 70 },
  headerText: {
    marginTop: 10,
    fontSize: 26, // Slightly smaller font
    fontWeight: "700",
    color: "#FFF",
  },
  profileSection: {
    right:14,
    alignItems: "center",
    padding: 20,
  },
  profileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  uploadPhotoText: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 10 },
  uploadSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B1C4DA",
    padding: 10,
    borderRadius: 12,
    marginBottom: 5,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  uploadText: { fontSize: 12, color: "#555", marginLeft: 10 },
  helperText: { fontSize: 10, color: "#888", textAlign: "center" },
  inputSection: { paddingHorizontal: 20 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  inputIcon: { marginRight: 15,marginTop:30, height: 24,     // Ensure height consistency across all icons
    width: 24,  },
  inputIcon2: { marginRight: 15,marginTop:50, height: 24,     // Ensure height consistency across all icons
    width: 24,  },

  inputContainer: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: "#555" ,marginVertical:5},
  label2:{fontSize: 14, fontWeight: "600", color: "#555" ,marginBottom:5},
  input: {
    borderWidth: 1,
    borderColor: "#B1C4DA",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width:'99%'

  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B1C4DA",
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width:'99%'
  },textContainer:{
    flex: 1, marginLeft: 10, backgroundColor: "#fff", borderTopRightRadius:10, borderBottomRightRadius:10, borderLeftColor:'#B1C4DA', borderLeftWidth:1
  },
  doneButton: {
    backgroundColor: "#B1C4DA",
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  doneButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: "auto",
  },
});

export default AddUser;







