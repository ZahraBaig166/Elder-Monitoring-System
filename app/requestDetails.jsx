import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../hooks/useConfig";

const RequestDetails = () => {
  const router = useRouter();
  const { requestId, requestType } = useLocalSearchParams(); // Extract query params
  const [requestDetails, setRequestDetails] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  const { apiBaseUrl, loading, error } = useConfig();

  useEffect(() => {
    if (loading || !apiBaseUrl || !requestId || !requestType) return;

    // Fetch the details of the selected request
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/requestDetails/${requestType}/${requestId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRequestDetails(data);
      } catch (err) {
        console.error('Error fetching request details:', err);
      }
    };

    fetchRequestDetails();
  }, [apiBaseUrl, requestId, requestType, loading]); // Added dependencies

  useEffect(() => {
    if (requestType === 'family' && apiBaseUrl && !loading) {
      // Fetch available caregivers only for family requests
      const fetchCaregivers = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/admin/caregivers`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCaregivers(data);
        } catch (err) {
          console.error('Error fetching caregivers:', err);
        }
      };

      fetchCaregivers();
    }
  }, [requestType, apiBaseUrl, loading]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/approve/${requestType}/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Approval failed: ${errorData.message}`);
        return;
      }

      alert('Request approved successfully!');
      router.push('/ViewRequest');
    } catch (err) {
      console.error('Error approving request:', err);
      alert('An unexpected error occurred.');
    }
  };

  const handleDecline = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/admin/decline/${requestType}/${requestId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to decline the request');
      }

      alert('Request declined successfully!');
      router.push('/ViewRequest');
    } catch (err) {
      console.error('Error declining request:', err);
      alert(err.message || 'Failed to decline request. Please try again.');
    }
  };

  if (loading || !apiBaseUrl) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading configuration...</Text>
      </View>
    );
  }

  if (!requestDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading request details...</Text>
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
        <Text>IM IN SJSJDJ</Text>
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
    padding: wp('5%'), // Responsive padding
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: wp('6%'), // Responsive title font size
    fontWeight: '700',
    marginBottom: hp('2%'), // Responsive margin
  },
  info: {
    fontSize: wp('4%'), // Responsive font size for text
    marginBottom: hp('1.5%'), // Responsive margin
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginVertical: hp('2%'),
  },
  declineButton: {
    backgroundColor: '#F44336',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  picker: {
    height: hp('6%'),
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    paddingLeft: wp('2%'),
  },
});

export default RequestDetails;
