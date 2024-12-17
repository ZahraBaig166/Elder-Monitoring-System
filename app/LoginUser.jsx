import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for eye icon
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useConfig from "../backend/../hooks/useConfig";
import { Alert } from "react-native";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const router = useRouter();
  const { apiBaseUrl } = useConfig();

  // Function to handle caregiver login
  const handleLoginCaregiver = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password");
      return;
    }
  
    try {
      const response = await fetch(`${apiBaseUrl}/login/caregiver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token, userId, type } = data;
        await AsyncStorage.setItem("authToken", String(token));
        await AsyncStorage.setItem("userId", String(userId));
        await AsyncStorage.setItem("type", String(type));
        console.log("Saved successfully");
        Alert.alert("Success", "Login successful");
        router.replace("DoctorDashboard");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };
  
  // Function to handle family login
  const handleLoginFamily = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    const response = await fetch(`${apiBaseUrl}/login/family`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, userId, type } = data;

      // Save token and userId in AsyncStorage
      try {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userId", String(userId));
        await AsyncStorage.setItem("type", type);
        console.log("Saved successfully");
      } catch (error) {
        console.error("AsyncStorage Error:", error);
      }

      // Redirect to Family Dashboard
      router.replace('/FamilyDashboard');
    } else {
      Alert.alert("Login Failed", data.message || "Invalid credentials");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/rectangles1.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.topSection}>
          <Image
            source={require("../assets/images/login.png")}
            style={styles.illustration}
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.title}>Hello there,</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#4874A6"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#4874A6"
            secureTextEntry={!showPassword} // Toggle visibility
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // Toggle the state
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#4874A6"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => router.replace("/ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLoginCaregiver}>
            <Text style={styles.buttonText}>Login Caregiver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLoginFamily}>
            <Text style={styles.buttonText}>Login Family</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("5%"),
  },
  topSection: {
    width: wp("100%"),
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  illustration: {
    width: wp("70%"),
    height: hp("25%"),
    resizeMode: "contain",
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: wp("7%"),
    color: "#4874A6",
    fontWeight: "bold",
    marginBottom: hp("3%"),
  },
  input: {
    width: wp("90%"),
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: hp("2%"),
    marginVertical: hp("1%"),
    borderWidth: 1,
    borderColor: "#4874A6",
    fontSize: wp("4%"),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: wp("90%"),
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4874A6",
    marginVertical: hp("1%"),
    paddingLeft: hp("2%"),
  },
  passwordInput: {
    flex: 1,
    fontSize: wp("4%"),
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: "#4874A6",
    fontSize: wp("3.5%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  buttonContainer: {
    width: wp("90%"),
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp("2%"),
  },
  button: {
    width: wp("40%"),
    backgroundColor: "#80A3CC",
    borderRadius: 10,
    paddingVertical: hp("2%"),
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});

export default LoginUser;
