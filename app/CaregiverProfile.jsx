import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import NavBar from "../components/NavBarPatients"; // Include NavBar Component
import useConfig from "../hooks/useConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CaregiverProfile = () => {
  const { apiBaseUrl } = useConfig();
   const router = useRouter();

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [caregiverData, setCaregiverData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { userId } = useLocalSearchParams(); // Get userId dynamically from route params

  const staticProfileImage =
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  useEffect(() => {
    const fetchCaregiverData = async () => {
      try {
        // Retrieve userId from AsyncStorage if not passed in route params
        let caregiverId = userId;

        if (!caregiverId) {
          caregiverId = await AsyncStorage.getItem("userId");
          console.log("Retrieved UserId from AsyncStorage:", caregiverId);
        }

        if (!caregiverId) {
          throw new Error("Caregiver ID is missing.");
        }

        // Fetch caregiver details from backend
        const response = await fetch(
          `${apiBaseUrl}/caregiverProfile/${caregiverId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch caregiver data");
        }

        const data = await response.json();
        setCaregiverData(data);
        console.log("Caregiver Data:", data);
      } catch (error) {
        console.error("Error fetching caregiver details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverData();
  }, [apiBaseUrl, userId]);

  const handleBack = () => {
    router.replace("/DoctorDashboard");
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: staticProfileImage }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileTitle}>Caregiver Profile</Text>
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#4874A6" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#6c757d" style={styles.icon} />
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.inputField}
                value={caregiverData?.name || "N/A"}
                editable={false}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#6c757d" style={styles.icon} />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputField}
                value={caregiverData?.email || "N/A"}
                editable={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#6c757d" style={styles.icon} />
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.inputField}
                value={caregiverData?.password || "N/A"}
                secureTextEntry={!showPassword}
                editable={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#6c757d"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* NavBar */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f9fafe",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#a8c4e1",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingVertical: 40,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 10,
    padding: 5,
  },
  profileImageContainer: {
    backgroundColor: "#d9e3f0",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#6c757d",
  },
  inputField: {
    flex: 2,
    fontSize: 16,
    color: "#495057",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
});

export default CaregiverProfile;
