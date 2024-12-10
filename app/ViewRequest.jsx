// ViewRequest.js (List of pending requests)

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // For navigation
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewRequest = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const router = useRouter(); // Use for navigation

  // Fetch pending requests (Caregiver & Family)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://192.168.18.176:3000/admin/pending');
        console.log("HDHDHDHDHDH")
        const data = await response.json();
        console.log("data",data);
        const allRequests = [
          // ...data.caregivers.map((item) => ({ ...item, type: 'Caregiver' })),
          ...data.families.map((item) => ({ ...item, type: 'Family' })),
        ];
        setPendingRequests(allRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = async (requestId, requestType) => {
    try {
      // Call the API to fetch request details from the backend
      const response = await fetch(`http://192.168.18.176:3000/admin/requestDetails/${requestId}`);
      if (response.ok) {
        const requestDetails = await response.json();
        console.log('Request Details:', requestDetails);
  
        // Navigate to the details page
        router.push(`/requestDetails/${requestId}/${requestType}`);

            } else {
        console.error('Failed to fetch request details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Pending Requests</Text>
        </View>

        {/* Pending Requests List */}
        <ScrollView style={styles.requestsContainer}>
        {pendingRequests.map((request, index) => (
  <TouchableOpacity
    key={index}
    style={styles.requestCard}
    onPress={() => handleRequestClick(request.id, request.type)} // Call the function
  >
    <Text style={styles.requestText}>
      {request.name} ({request.type})
    </Text>
  </TouchableOpacity>
))}


        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  requestsContainer: {
    marginTop: 10,
  },
  requestCard: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  requestText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ViewRequest;