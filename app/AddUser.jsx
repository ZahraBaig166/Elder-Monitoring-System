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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { backgroundColor: "#ADC1D8", paddingVertical: 20, alignItems: "center", borderBottomLeftRadius: 30, borderBottomRightRadius: 30, height: "30%" },
  backButton: { position: "absolute", left: 20, top: 20 },
  addIcon: { marginBottom: 5, marginTop: 40 },
  headerText: { marginTop: 10, fontSize: 30, fontWeight: "800", color: "#FFF" },
  profileSection: { alignItems: "center", marginVertical: 20 },
  profileRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" },
  profileImage: { width: 50, height: 50, borderRadius: 25, paddingBottom: 90 },
  textSection: { flex: 1, marginLeft: 10 },
  uploadPhotoText: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 10 },
  uploadSection: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#8E8E8E", padding: 10, borderRadius: 10, marginBottom: 5 },
  uploadText: { fontSize: 14, color: "#8E8E8E", marginLeft: 10 },
  helperText: { fontSize: 10, color: "#8E8E8E", textAlign: "center" },
  inputSection: { paddingHorizontal: 20 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  inputIcon: { marginBottom: 28, marginRight: 10 },
  inputIcon2: { marginBottom: 80, marginRight: 10 },
  inputContainer: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600", color: "#1F1F1F" },
  label2: { fontSize: 16, fontWeight: "600", color: "#1F1F1F", marginBottom: 10 },
  input: { borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 5 },
  phoneInputContainer: { paddingHorizontal: 10, marginVertical: 10, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#8E8E8E", borderRadius: 10 },
  textContainer: { flex: 1, marginLeft: 10, backgroundColor: "#fff" },
  textInput: { fontSize: 16, padding: 2, color: "#333", flex: 1 },
  codeText: { fontSize: 16, color: "#555" },
  flagButton: { padding: 2 },
  doneButton: { backgroundColor: "#ADC1D8", borderRadius: 30, paddingVertical: 15, alignItems: "center", alignContent: "center", alignSelf: "center", width: "50%", marginHorizontal: 20, marginTop: 0 },
  doneButtonText: { fontSize: 20, fontWeight: "600", color: "#FFF" },
  footer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderTopWidth: 1, borderColor: "#E0E0E0", marginTop: "auto" },
  countryPickerButton: {
    padding: 2,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
});

export default AddUser;







