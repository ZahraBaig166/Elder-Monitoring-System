import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../hooks/useConfig";

const UserDetails = () => {
  const { userId, userType } = useLocalSearchParams();
  const { apiBaseUrl } = useConfig();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`${apiBaseUrl}/admin/users/${userType}/${userId}`);
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/users/${userType}/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userDetails = await response.json();
        console.log("User Details:", userDetails);

        // Update state
        setUserDetails(userDetails);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [apiBaseUrl, userType, userId]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: hp(20) }} size="large" color="#4874A6" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Details</Text>
      {userDetails &&
        Object.entries(userDetails).map(([key, value], index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>{key.replace("_", " ").toUpperCase()}</Text>
            <Text style={styles.value}>{value || "N/A"}</Text>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: wp(5), backgroundColor: "#F9F9F9" },
  title: { fontSize: wp(5), fontWeight: "bold", marginBottom: hp(2) },
  card: {
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: "#FFF",
    borderRadius: wp(2),
    elevation: 2,
  },
  label: { fontSize: wp(4), fontWeight: "600", color: "#333" },
  value: { fontSize: wp(3.5), color: "#555" },
});

export default UserDetails;
