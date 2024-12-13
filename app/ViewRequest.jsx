import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router"; // For navigation
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";

const ViewRequest = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // State for pending requests
  const { apiBaseUrl, loading, error } = useConfig();

  // Fetch pending requests (Caregiver & Family)
  useEffect(() => {
    if (loading || !apiBaseUrl) return; // Wait for apiBaseUrl to load
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/pending`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received data:", data); // Debugging log
        const allRequests = [
          ...(data.caregivers || []).map((item) => ({ ...item, type: "Caregiver" })),
          ...(data.families || []).map((item) => ({ ...item, type: "Family" })),
        ];
        console.log("Processed requests:", allRequests); // Debugging log
        setPendingRequests(allRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchRequests();
  }, [loading, apiBaseUrl]); // Depend on loading and apiBaseUrl

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

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
                pathname: "/requestDetails",
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
    backgroundColor: "#FFFFFF",
  },
  main: {
    flex: 1,
    padding: wp("5%"),
  },
  header: {
    marginBottom: hp("2%"),
  },
  headerText: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#000",
  },
  requestsContainer: {
    marginTop: hp("2%"),
  },
  requestCard: {
    padding: wp("4%"),
    backgroundColor: "#f0f0f0",
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
  },
  requestText: {
    fontSize: wp("4%"),
    color: "#333",
  },
});

export default ViewRequest;
