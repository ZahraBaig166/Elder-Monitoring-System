import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { useRoute } from 'expo-router'; // Import the hook to get route params



const RequestDetails = () => {
  const route = useRouter();
  console.log("router quer",route.query)
  const { requestId, requestType } = route.query; // Access requestId and requestType
  console.log('Request ID:', requestId);
  console.log('Request Type:', requestType);
  const [requestDetails, setRequestDetails] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  useEffect(() => {
    // Fetch the details of the selected request
    const fetchRequestDetails = async () => {
      try {
        // Correct template literal syntax with backticks
        const response = await fetch('http://192.168.18.176:3000/admin/pending/${requestId}');
        const data = await response.json();
        setRequestDetails(data);
      } catch (error) {
        console.error('Error fetching request details:', error);
      }
    };

    const fetchCaregivers = async () => {
      try {
        const response = await fetch('http://192.168.18.176:3000/admin/caregivers');
        const data = await response.json();
        setCaregivers(data);
      } catch (error) {
        console.error('Error fetching caregivers:', error);
      }
    };

    fetchRequestDetails();
    if (type === 'family') {
      fetchCaregivers();
    }
  }, [requestId, type]);

  const handleApprove = async () => {
    try {
      const body = { caregiverId: selectedCaregiver }; // Add caregiver ID if type is 'family'
      // Correct template literal syntax with backticks
      await fetch('http://192.168.18.176:3000/admin/approve/${requestId}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      router.push('/ViewRequest'); // Navigate back to the list page after approving
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async () => {
    try {
      // Correct template literal syntax with backticks
      await fetch('http://192.168.18.176:3000/admin/decline/${requestId}', {
        method: 'POST',
      });
      router.push('/ViewRequest'); // Navigate back to the list page after declining
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
      <Text style={styles.info}>Name: {requestDetails.name}</Text>
      <Text style={styles.info}>Contact: {requestDetails.contact}</Text>
      <Text style={styles.info}>Type: {requestDetails.type}</Text>

      {/* Conditionally render the caregiver dropdown for 'family' type requests */}
      {type === 'family' && (
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