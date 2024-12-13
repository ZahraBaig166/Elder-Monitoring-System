import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// require('dotenv').config();

const RequestDetails = () => {
  const router = useRouter();
  const { requestId, requestType } = useLocalSearchParams(); // Extract query params
  const [requestDetails, setRequestDetails] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  useEffect(() => {
    if (requestId && requestType) {
      // Fetch the details of the selected request with requestType as part of the URL
      const fetchRequestDetails = async () => {
        try {
          const response = await fetch(
            `http://192.168.43.228:3000/admin/requestDetails/${requestType}/${requestId}` // Using /type/id format
          );
          const text = await response.text();
  
          const data = JSON.parse(text); // Parse JSON from text
          setRequestDetails(data);
        } catch (error) {
          console.error('Error fetching request details:', error);
        }
      };
  
      fetchRequestDetails();
    }
  }, [requestId, requestType]); 
   // Trigger effect when requestId or requestType changes
  useEffect(() => {
    console.log("Request Type:", requestType); // Log whenever `requestType` changes
    console.log(caregivers.length);
  }, [requestType]);
  
  const handleApprove = async () => {
    try {
      const response = await fetch(`http://192.168.43.228:3000/admin/approve/${requestType}/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error approving request:', errorData.message);
        alert(`Approval failed: ${errorData.message}`);  // Use backticks for string interpolation
        return;
      }
  
      alert('Request approved successfully!');
      router.push({ pathname: '/ViewRequest' });
    } catch (error) {
      console.error('Error approving request in frontend file:', error);
      alert('An unexpected error occurred.');
    }
  };
  


  

const handleDecline = async () => {
  try {
    const response = await fetch(`http://192.168.43.228:3000/admin/decline/${requestType}/${requestId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to decline the request');
    }

    alert('Request declined successfully!');
    router.push({ pathname: '/ViewRequest' }); // Navigate back to the list page
  } catch (error) {
    console.error('Error declining request:', error);
    alert(error.message || 'Failed to decline request. Please try again.');
  }
};


  if (!requestDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Details</Text>
      <Text style={styles.info}>Request ID: {requestDetails.id}</Text>
      <Text style={styles.info}>Name: {requestDetails.name}</Text>
      <Text style={styles.info}>Email: {requestDetails.email}</Text>
      <Text style={styles.info}>Relationship to Patient: {requestDetails.relationship_to_patient}</Text>
      <Text style={styles.info}>Phone Number: {requestDetails.phone_number || 'N/A'}</Text>
      <Text style={styles.info}>Address: {requestDetails.address}</Text>
      <Text style={styles.info}>Approval Status: {requestDetails.is_approved ? 'Approved' : 'Pending'}</Text>
      <Text style={styles.info}>Date Created: {new Date(requestDetails.date_created).toLocaleString()}</Text>
      <Text style={styles.info}>Patient Name: {requestDetails.patient_name}</Text>
      <Text style={styles.info}>Patient Age: {requestDetails.patient_age}</Text>
      <Text style={styles.info}>Patient Medical Conditions: {requestDetails.patient_medical_conditions}</Text>
      <Text style={styles.info}>Patient Status: {requestDetails.patient_status}</Text>
      <Text style={styles.info}>Patient Emergency Contact: {requestDetails.patient_emergency_contact}</Text>

      <View>
      <Text> IM IN SJSJDJ</Text>
      {requestType === 'family' && (
  <>
    <Text style={styles.info}>Assign Caregiver:</Text>
    {caregivers.length > 0 ? (
      <Picker
        selectedValue={selectedCaregiver}
        onValueChange={(itemValue) => setSelectedCaregiver(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Caregiver" value={null} />
        {caregivers.map((caregiver) => (
          <Picker.Item key={caregiver.id} label={caregiver.name} value={caregiver.id} />
        ))}
      </Picker>
    ) : (
      <Text>No caregivers available</Text>
    )}
  </>
)}
    </View>
     

      {/* Approve or Decline buttons */}
      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
        <Text style={styles.buttonText}>Decline</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  declineButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default RequestDetails;
