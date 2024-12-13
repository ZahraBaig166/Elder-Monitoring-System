import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../backend/../hooks/useConfig";

const CaregiverRegistration = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [educations, setEducations] = useState([{ id: 1, degree: "" }]);
  const { apiBaseUrl, loading, error } = useConfig();

  // Add education field
  const addEducationField = () => {
    setEducations([...educations, { id: educations.length + 1, degree: "" }]);
  };

  const handleEducationChange = (text, id) => {
    const updatedEducations = educations.map((edu) =>
      edu.id === id ? { ...edu, degree: text } : edu
    );
    setEducations(updatedEducations);
  };

  const handleSubmit = async () => {
    const caregiverData = {
      name,
      email,
      age,
      address,
      educations,
    };
    console.log("Caregiver Data:", caregiverData);

    try {
      const response = await fetch(`${apiBaseUrl}/submit/caregiver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caregiverData),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        // Success alert and redirection after a brief delay
        Alert.alert(
          "Registration Successful",
          "Caregiver registered successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                // Redirect back to start screen after alert
                setTimeout(() => {
                  router.push("/"); // Redirect to the start screen
                }, 1500); // Wait for 1.5 seconds before redirecting
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // Handle form submission failure
        Alert.alert("Error", responseText || "Error registering caregiver.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "An error occurred while submitting the form.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
            <Icon name="arrow-left" size={hp("3%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Caregiver Registration</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={styles.educationContainer}>
            <Text style={styles.label}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={styles.educationField}>
                <TextInput
                  style={styles.input}
                  placeholder={`Degree ${edu.id}`}
                  value={edu.degree}
                  onChangeText={(text) => handleEducationChange(text, edu.id)}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addEducationField}>
              <Icon name="plus" size={hp("2.5%")} color="#FFF" />
              <Text style={styles.addButtonText}>Add Another</Text>
            </TouchableOpacity>
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
    paddingBottom: hp("5%"), // Space at the bottom to ensure all fields are accessible
  },
  backButton: {
    padding: hp("1%"),
    marginBottom: hp("2%"),
  },
  headerText: {
    fontSize: hp("4%"),
    fontWeight: "700",
    color: "#263238",
    marginBottom: hp("2%"),
  },
  inputContainer: {
    marginBottom: hp("2%"),
  },
  label: {
    fontSize: hp("2%"),
    fontWeight: "400",
    color: "#000",
    marginBottom: hp("0.5%"),
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    padding: hp("1%"),
    backgroundColor: "#F9F9F9",
  },
  educationContainer: {
    marginBottom: hp("2%"),
  },
  educationField: {
    marginBottom: hp("1%"),
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ADC1D8",
    borderRadius: wp("5%"),
    paddingVertical: hp("1%"),
    marginTop: hp("1%"),
  },
  addButtonText: {
    fontSize: hp("2%"),
    fontWeight: "700",
    color: "#FFF",
    marginLeft: wp("2%"),
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: wp("5%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
    marginTop: hp("2%"),
  },
  submitButtonText: {
    fontSize: hp("3%"),
    fontWeight: "700",
    color: "#FFF",
  },
});

export default CaregiverRegistration;