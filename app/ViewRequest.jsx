import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router'; // For navigation

const ViewRequest = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  // Fetch pending requests (Caregiver & Family)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://10.135.20.162:3000/admin/pending');
        const data = await response.json();
        console.log('Received data:', data); // Debugging log
        const allRequests = [
          ...(data.caregivers || []).map((item) => ({ ...item, type: 'Caregiver' })),
          ...(data.families || []).map((item) => ({ ...item, type: 'Family' })),
        ];
        console.log('Processed requests:', allRequests); // Debugging log
        setPendingRequests(allRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };
  
    fetchRequests();
  }, []);
  
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
            <Link
              key={index}
              href={{
                pathname: '/requestDetails',
                params: { requestId: request.id, requestType: request.type },
              }}
            >
              <View style={styles.requestCard}>
                <Text style={styles.requestText}>
                  {request.name} ({request.type})
                </Text>
              </View>
            </Link>
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
