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
import { useRouter } from "expo-router";

const LoginUser = () => {
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const router = useRouter();
console.log("email ",email);
console.log("password",password);
  // Function to handle caregiver login
  const handleLoginCaregiver = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    } console.log("hello i m in caregiver button")
      const response = await fetch("http://192.168.43.228:3000/login/caregiver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),  
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/DoctorDashboard");
      } else {
        alert(data.message || "Login failed");
      }

  };

  // Function to handle family login
  const handleLoginFamily = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    } console.log("hello i m in caregiver button")
      const response = await fetch("http://192.168.43.228:3000/login/family", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),  
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/FamilyDashboard");
      } else {
        alert(data.message || "Login failed");
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
          value={email}  // Bind the value to the state
          onChangeText={setEmail}  // Update the email state when input changes
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#4874A6"
          secureTextEntry
          value={password}  // Bind the value to the state
          onChangeText={setPassword}  // Update the password state when input changes
        />

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
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
    width: "100%", // Ensures it covers the full width
    height: "100%", // Ensures it covers the full height
    backgroundColor: "#000000", // Prevents black gaps
  },
  container: {
    flex: 1,
    justifyContent: "flex-start", // Move content to start
    alignItems: "flex-start", // Align content to the left
    paddingHorizontal: 20, // Add padding on the sides
    paddingTop: 50, // Adjust spacing from the top
  },
  topSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  illustration: {
    width: "70%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: "#4874A6",
    fontWeight: "bold",
    textAlign: "left", // Align text to the left
    marginTop: 40,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#4874A6",
    fontSize: 16,
    textAlign: "left", // Align placeholder text to the left
  },
  forgotPassword: {
    color: "#4874A6",
    fontSize: 14,
    textAlign: "center", // Align forgot password to the center
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row", // Place buttons in a row
    justifyContent: "space-evenly", // Space buttons evenly
    marginTop: -10,
  },
  button: {
    width: "35%",
    backgroundColor: "#80A3CC",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    boarderColor: "#000000",
    margin: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginUser;
