import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
// require('dotenv').config();


const LoginAdmin = () => {
  const router = useRouter();

  // State to manage email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {

      console.log("Email:", email);
      console.log("Password:", password);

      // Make a POST request to the /admin/login route
      const response = await fetch("http://192.168.43.228:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json(); // Parse the JSON response
      console.log(data.message); // Log the response message
  
      if (response.ok) {
        // If login is successful, navigate to the dashboard
        router.push("/Dashboard");
      } else {
        // Handle login error
        if (data.message === "Invalid email (username)") {
          Alert.alert("Login Failed", "The email you entered is incorrect.");
        } else if (data.message === "Invalid password") {
          Alert.alert("Login Failed", "The password you entered is incorrect.");
        } else {
          Alert.alert("Login Failed", data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred while logging in. Please try again.");
    }
  };
  

  return (
    <ImageBackground
      source={require("@/assets/images/rectangles1.png")} // Update the background image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.topSection}>
          <Image
            source={require("../assets/images/login.png")} // Ensure the path is correct
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
          onChangeText={(text) => setEmail(text)} // Update email state
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#4874A6"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)} // Update password state
        />

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
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
    alignItems: "center", // Center the button horizontally
    marginTop: 30,
  },
  button: {
    width: "50%",
    backgroundColor: "#80A3CC",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#000000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginAdmin;
