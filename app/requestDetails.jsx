import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import useConfig from "../hooks/useConfig";

const RequestDetails = () => {
  const router = useRouter();
  const { requestId, requestType } = useLocalSearchParams(); // Extract query params
  const [requestDetails, setRequestDetails] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const { apiBaseUrl, loading, error } = useConfig();
  const [isRequestLoading, setIsRequestLoading] = useState(false); // Added state for loading request details
  const [isCaregiverLoading, setIsCaregiverLoading] = useState(false); // Added state for loading caregivers

  // Fetch request details
  useEffect(() => {
    if (loading || !apiBaseUrl || !requestId || !requestType) return;

    const fetchRequestDetails = async () => {
      setIsRequestLoading(true); // Start loading state
      try {
        const response = await fetch(`${apiBaseUrl}/admin/requestDetails/${requestType}/${requestId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRequestDetails(data);
      } catch (err) {
        console.error("Error fetching request details:", err);
      } finally {
        setIsRequestLoading(false); // Stop loading state
      }
    };

    fetchRequestDetails();
  }, [apiBaseUrl, requestId, requestType, loading]);

  // Fetch caregivers (if family request)
  useEffect(() => {
    if (requestType === "Family" && apiBaseUrl && !loading) {
      const fetchCaregivers = async () => {
        setIsCaregiverLoading(true); // Start caregiver loading state
        try {
          const response = await fetch(`${apiBaseUrl}/admin/caregivers`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setCaregivers(data);
        } catch (err) {
          console.error("Error fetching caregivers:", err);
        } finally {
          setIsCaregiverLoading(false); // Stop caregiver loading state
        }
      };

      fetchCaregivers();
    }
  }, [requestType, apiBaseUrl, loading]);

  const handleApprove = async () => {
    // let caregiverIdToAssign = selectedCaregiver;
  
    // if (requestType === "Family") {
    //   if (!caregiverIdToAssign) {
    //     if (caregivers.length === 0) {
    //       alert("No caregivers available to assign.");
    //       return;
    //     }
  
    //     // Assign a random caregiver
    //     const randomIndex = Math.floor(Math.random() * caregivers.length);
    //     caregiverIdToAssign = caregivers[randomIndex].id;
    //   }
  
    //   try {
    //     const response = await fetch(`${apiBaseUrl}/admin/assignCaregiver`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ requestId, caregiverId: caregiverIdToAssign }),
    //     });
  
    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       alert(`Caregiver assignment failed: ${errorData.message}`);
    //       return;
    //     }
  
    //     alert("Caregiver assigned successfully!");
    //   } catch (err) {
    //     console.error("Error assigning caregiver:", err);
    //     alert("An error occurred while assigning the caregiver.");
    //     return;
    //   }
    // }
  
    // Continue approval
    try {
      const response = await fetch(`${apiBaseUrl}/admin/approve/${requestType}/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Approval failed: ${errorData.message}`);
        return;
      }
  
      alert("Request has been approved successfully!");
      router.replace("/ViewRequest");
    } catch (err) {
      console.error("Error approving request:", err);
      alert("An unexpected error occurred.");
    }
  };
  
  

  const handleDecline = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/decline/${requestType}/${requestId}`, {
        method: "POST",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to decline the request");
      }
  
      // Show success alert after decline
      alert("Request has been declined successfully!");
      
      // Redirect to ViewRequest page after decline
      router.replace("/ViewRequest");
  
    } catch (err) {
      console.error("Error declining request:", err);
      alert(err.message || "Failed to decline request. Please try again.");
    }
  };

  if (loading || !apiBaseUrl) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading configuration...</Text>
      </View>
    );
  }

  if (isRequestLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading request details...</Text>
      </View>
    );
  }

  if (!requestDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No request details found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/ViewRequest")}>
          <Icon name="arrow-left" size={wp("5%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Details</Text>
      </View>

      {/* Request Details */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("5%"),
          paddingBottom: hp("5%"), // Adds space at the bottom of the page
        }}
      >
        {(requestType === "Family"
          ? [
              { label: "Name", value: requestDetails.name },
              { label: "Email", value: requestDetails.email },
              { label: "Phone", value: requestDetails.phone_number || "N/A" },
              { label: "Address", value: requestDetails.address },
              { label: "Patient Name", value: requestDetails.patient_name },
              { label: "Patient Age", value: requestDetails.patient_age },
              {
                label: "Medical Conditions",
                value: requestDetails.patient_medical_conditions || "N/A",
              },
              { label: "Patient Status", value: requestDetails.patient_status },
              {
                label: "Emergency Contact",
                value: requestDetails.patient_emergency_contact,
              },
            ]
          : [
              { label: "Name", value: requestDetails.name },
              { label: "Email", value: requestDetails.email },
              { label: "Age", value: requestDetails.age },
              { label: "Address", value: requestDetails.address },
              // { label: "Education", value: requestDetails.education },
            ]
        ).map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}

{requestType === "Family" && (
  <View style={styles.card}>
    <Text style={styles.label}>Assign Caregiver:</Text>
    {isCaregiverLoading ? (
      <ActivityIndicator size="large" color="#000" />
    ) : caregivers.length > 0 ? (
     
      <Picker
      selectedValue={selectedCaregiver}
      onValueChange={(itemValue) => setSelectedCaregiver(itemValue)}
      style={{ height: 50 }} // Explicit height
    >
      <Picker.Item label="Select a Caregiver" value="" />
      {caregivers.map((caregiver) =>
        caregiver.id ? (
          <Picker.Item
            key={caregiver.id}
            label={caregiver.name}
            value={caregiver.id.toString()}
          />
        ) : null
      )}
    </Picker>
    ) : (
      <Text>No caregivers available</Text>
    )}
  </View>
)}


        {/* Approve and Decline Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp("6%"), // Increased padding at the top for more space
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    marginLeft: wp("3%"),
  },
  scrollView: {
    paddingHorizontal: wp("5%"),
  },
  card: {
    marginBottom: hp("2%"),
    padding: wp("4%"),
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent background
    borderRadius: wp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp("0.5%"),
  },
  value: {
    fontSize: wp("4%"),
    color: "#555",
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    zIndex: 10, // Important if inside ScrollView or overlapping views
  },
  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("3%"),
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: hp("2%"),
    borderRadius: wp("2%"),
    marginRight: wp("2%"),
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: hp("2%"),
    borderRadius: wp("2%"),
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: wp("4%"),
  },
});


export default RequestDetails;