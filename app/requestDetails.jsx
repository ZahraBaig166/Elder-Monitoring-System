import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const RequestDetails = () => {
  const router = useRouter();
  const { requestId, requestType } = useLocalSearchParams(); // Extract query params
  const [requestDetails, setRequestDetails] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  useEffect(() => {
    if (requestId && requestType) {
      // Fetch the details of the selected request
      const fetchRequestDetails = async () => {
        try {
          const response = await fetch(`http://10.135.53.147:3000/admin/requestDetails/${requestId}`);
          const text = await response.text(); // Get raw response as text
          console.log('Response text from requestDetail:', text);
      
          const data = JSON.parse(text); // Parse JSON from text
          setRequestDetails(data);
        } catch (error) {
          console.error('Error fetching request details:', error);
        }
      };
      

      // Fetch caregivers if the request type is 'family'
      const fetchCaregivers = async () => {
        try {
          const response = await fetch('http://10.135.53.147:3000/admin/caregivers');
          const data = await response.json();
          setCaregivers(data);
        } catch (error) {
          console.error('Error fetching caregivers:', error);
        }
      };

      fetchRequestDetails();
      if (requestType === 'family') {
        fetchCaregivers();
      }
    }
  }, [requestId, requestType]);

  const handleApprove = async () => {
    try {
      const body = requestType === 'family' ? { caregiverId: selectedCaregiver } : {}; // Include caregiverId if type is 'family'
      await fetch(`http://10.135.53.147:3000/admin/approve/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      router.push({ pathname: '/ViewRequest' }); // Navigate back to the list page after approving
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await fetch(`http://10.135.53.147:3000/admin/decline/${requestId}`, {
        method: 'POST',
      });
      router.push({ pathname: '/ViewRequest' }); // Navigate back to the list page after declining
    } catch (error) {
      console.error('Error declining request:', error);
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

      {/* Conditionally render the caregiver dropdown for 'family' type requests */}
      {requestType === 'family' && (
        <>
          <Text style={styles.info}>Assign Caregiver:</Text>
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
        </>
      )}

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
