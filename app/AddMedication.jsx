import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import useConfig from "../hooks/useConfig";
import useAuth from "../hooks/useAuth";

const AddMedication = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [interval, setInterval] = useState("");
  const [duration, setDuration] = useState("");
  const [medications, setMedications] = useState([]);

  const { apiBaseUrl } = useConfig();
  const { user } = useAuth(); // Get caregiver info
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || !user.userId) {
        // console.error("User or Caregiver ID not loaded yet. Waiting...");
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/patients`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setPatients(data);
      } catch (err) {
        // console.error("Failed to load patients:", err);
        // Alert.alert("Error", "Unable to load patient list.");
      }
    };

    fetchPatients();
  }, [apiBaseUrl, user?.userId]);

  const handleAddMedication = async () => {
    if (!selectedPatientId) {
      Alert.alert("Missing Info", "Please select a patient.");
      return;
    }
    if (!medicationName || !dosage || !interval || !duration) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }
    console.log("MEDICATION NAME", medicationName);

    const payload = {
      patient_id: selectedPatientId,
      medication_name: medicationName,
      dosage,
      interval,
      duration: parseInt(duration),
      next_dose_time: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch(`${apiBaseUrl}/medications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add medication");

      Alert.alert("Success", "Medication added successfully.");

      // Reset form
      setSelectedPatientId("");
      setMedicationName("");
      setDosage("");
      setInterval("");
      setDuration("");
      router.replace("/DoctorDashboard"); // navigate back if you want
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-left" size={wp("5%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Medication</Text>

          {/* Patient Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Patient</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedPatientId}
                onValueChange={(itemValue) => setSelectedPatientId(itemValue)}
              >
                <Picker.Item label="Choose a patient" value="" 
                 
                  color="#000" />
                {patients.map((patient) => (
                  <Picker.Item
                  
                    key={patient.patient_id}
                    label={`${patient.name}`}
                    value={patient.patient_id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Medication Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={medicationName}
              onChangeText={setMedicationName}
              placeholder="Enter medication name"
            />
          </View>

          {/* Dosage */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g., 500mg"
            />
          </View>

          {/* Interval */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Interval</Text>
            <TextInput
              style={styles.input}
              value={interval}
              onChangeText={setInterval}
              placeholder="e.g., every 6 hours"
            />
          </View>

          {/* Duration */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration (days)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 7"
              keyboardType="numeric"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
            <Text style={styles.addButtonText}>ADD</Text>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: wp("2%"),
    backgroundColor: "#C0C0C0",
  },
  addButton: {
    backgroundColor: "#ADC1D8",
    borderRadius: wp("8%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
  },
  addButtonText: {
    fontSize: wp("6%"),
    fontWeight: "700",
    color: "#FFF",
  },
});

export default AddMedication;