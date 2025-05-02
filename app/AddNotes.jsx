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
  import React, { useState, useEffect } from "react";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import useConfig from "../hooks/useConfig";
  import RNPickerSelect from "react-native-picker-select";
  
    import useAuth from "../hooks/useAuth";
  
  const AddNotes = () => {
    const [selectedPatient, setSelectedPatient] = useState("");
    const [note, setNote] = useState("");
     const [patients, setPatients] = useState([]);
     const [searchText, setSearchText] = useState('');
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  
    const router = useRouter();
    const { apiBaseUrl, loading, error } = useConfig();
    const { caregiver_id } = useLocalSearchParams(); 
    const { user, loading: authLoading } = useAuth();// caregiverId will come in params
  
    useEffect(() => {
        // Fetch assigned patients
        const fetchPatients = async () => {
        //   if (!apiBaseUrl) {
        //     console.error("API base URL is not defined.");
        //     return;
        //   }
      
        if (!user || !user.userId) {
            // console.error("User or Caregiver ID not loaded yet. Waiting...");
            return;
          }
      
          setIsLoadingPatients(true);
          try {
            console.log("Fetching assigned patients...");
            console.log("CAREGIVER ID:", user.userId);
      
            const response = await fetch(`${apiBaseUrl}/caregiver/${user.userId}/patients`);
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error fetching patients: ${response.status} ${errorText}`);
            }
      
            const data = await response.json();
      
            if (!Array.isArray(data)) {
              throw new Error("Unexpected response format: Expected an array of patients.");
            }
      
            setPatients(data); // Save patients
          } catch (error) {
            // console.error('Error fetching patients:', error);
          } finally {
            setIsLoadingPatients(false);
            if (patients.length > 0) {
              console.log("Patients fetched successfully:", patients.length);
            }
          }
          
        };
      
        fetchPatients();
    }, [apiBaseUrl, user?.userId]);
  
    const handleSubmit = async () => {
        
        console.log("Selected Patient:", selectedPatient);  
      if (!selectedPatient || !note) {
        alert("Please select a patient and write a note.");
        return;
      }
  
  
      try {
        const response = await fetch(`${apiBaseUrl}/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caregiver_id: user.userId, // use user.userId instead of caregiverId from params
            patient_id: selectedPatient,
            note,
          }),
        });          
        const data = await response.json();
console.log("Response from server:", data);
  
        if (data.success) {
          alert("Note added successfully");
          router.replace("/DoctorDashboard"); // Redirect to caregiver dashboard
        } else {
          alert("Failed to add note");
        }
      } catch (error) {
        console.error("Error adding note:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Icon name="sticky-note" size={30} color="#FFFFFF" style={styles.plusIcon} />
              <Text style={styles.headerText}>Add Note</Text>
            </View>
  
            {/* Form */}
            <View style={styles.formContainer}>
              {/* Patient Selection Dropdown */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Select Patient</Text>
                <RNPickerSelect
                onValueChange={(value) => setSelectedPatient(value)}
                items={patients
                    .filter((patient) => patient?.patient_id && patient?.name)  // Filter out invalid patients
                    .map((patient) => ({
                    label: patient.name,
                    value: patient.patient_id,
                    }))
                }
                  
                placeholder={{ label: "Select a patient..." ,value: "" }}
                style={{
                    inputAndroid: {
                    ...styles.input,
                    paddingRight: 30,
                    },
                    inputIOS: {
                    ...styles.input,
                    paddingRight: 30,
                    },
                    placeholder: { color: "#D3D3D3" },
                    iconContainer: {
                    top: 10,
                    right: 12,
                    },
                }}
                Icon={() => <Icon name="caret-down" size={20} color="#B0C4DE" />}
                useNativeAndroidPickerStyle={false}
                disabled={isLoadingPatients}
                />

                
              </View>
  
              {/* Note Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Note</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your note here"
                  placeholderTextColor="#D3D3D3"
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={6}
                />
              </View>
            </View>
  
            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitButtonText}>{loading ? "Submitting..." : "Submit"}</Text>
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
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 20, // Adds space at the bottom
    },
    header: {
      backgroundColor: "#ADC1D8",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      height: 200,
    },
    plusIcon: {
      marginBottom: 10,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    formContainer: {
      paddingHorizontal: 20,
      marginTop: 10,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: "#263238",
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#B0C4DE",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: "#F9F9F9",
      fontSize: 16,
      color: "#263238",
    },
    phoneInputContainer: {
      borderWidth: 1,
      borderColor: "#B0C4DE",
      borderRadius: 8,
      backgroundColor: "#F9F9F9",
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    textContainer: {
      backgroundColor: "#F9F9F9",
    },
    textInput: {
      fontSize: 16,
      color: "#000",
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#B0C4DE",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 20,
      height: 120,
      backgroundColor: "#F9F9F9",
      textAlignVertical: "top",
      fontSize: 16,
      color: "#263238",
    },
    submitButton: {
      backgroundColor: "#ADC1D8",
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 30,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
    },
  });
  
  
  export default AddNotes;
  