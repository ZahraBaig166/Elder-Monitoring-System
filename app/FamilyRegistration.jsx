import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import PhoneInput from "react-native-phone-number-input";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../backend/../hooks/useConfig";
import { Dropdown } from 'react-native-element-dropdown';  // Import the dropdown component

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
  const [patientCondition, setPatientCondition] = useState("");  // State to hold the selected condition
  const phoneInput = useRef(null);
  const { apiBaseUrl, loading, error } = useConfig();

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
        condition: patientCondition,  // Send the selected condition
        emergencyContact,
      },
    };

    try {
      console.log(familyData);
      const response = await fetch(`${apiBaseUrl}/submit/family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(familyData),
      });

      const responseText = await response.text();
      console.log("Response Text: ", responseText);

      if (response.ok) {
        alert("Family Registration Successful!\n" + responseText);
        router.push("/"); // Navigate back to the start screen
      } else {
        alert("Error registering family: " + responseText || "Unknown error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting the form");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Family Registration</Text>

          {/* Family Information */}
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
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient Status:</Text>
            <TextInput style={styles.input} value={patientStatus} onChangeText={setPatientStatus} />
          </View> */}
          
          {/* Dropdown for Patient Condition */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Patient Condition:</Text>
            <Dropdown
              style={styles.dropdown}
              data={[
                { label: "Stable", value: "stable" },
                { label: "Moderate", value: "moderate" },
                { label: "Critical", value: "critical" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Condition"
              value={patientStatus}
              onChange={(item) => setPatientStatus(item.value)}
            />
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: wp("5%"),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: hp("5%"),
  },
  backButton: {
    padding: wp("2%"),
    marginBottom: hp("2%"),
  },
  headerText: {
    fontSize: wp("8%"),
    fontWeight: "700",
    color: "#263238",
    marginBottom: hp("2%"),
  },
  inputContainer: {
    marginBottom: hp("2%"),
  },
  label: {
    fontSize: wp("4.5%"),
    fontWeight: "400",
    color: "#000",
    marginBottom: hp("1%"),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    backgroundColor: "#F9F9F9",
    fontSize: wp("4%"),
  },
  patientSectionText: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#000",
    marginBottom: hp("2%"),
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderRadius: wp("2%"),
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    width: "100%",
  },
  textContainer: {
    backgroundColor: "#F9F9F9",
  },
  submitButton: {
    backgroundColor: "#ADC1D8",
    borderRadius: wp("8%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
  },
  submitButtonText: {
    fontSize: wp("6%"),
    fontWeight: "700",
    color: "#FFF",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    backgroundColor: "#F9F9F9",
    fontSize: wp("4%"),
  },
});

export default FamilyRegistration;
