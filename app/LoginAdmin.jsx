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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useConfig from "../backend/../hooks/useConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import { UserProvider } from '../context/userContext';  // Adjust the path if needed


const LoginAdmin = () => {
  const { apiBaseUrl, loading, error } = useConfig();
  const router = useRouter();
  
  // State to manage email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);

      // Make a POST request to the /admin/login route
      const response = await fetch(`${apiBaseUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json(); // Parse the JSON response
      console.log(data.message); // Log the response message

      if (response.ok) {
        // Store the token after successful login
        const token = data.token; // Assuming the token is returned as 'token'
        console.log("this is token",token);
        await AsyncStorage.setItem('authToken', token); // Store the token in AsyncStorage

        // If login is successful, redirect to the dashboard
        setTimeout(() => {
          router.replace("/Dashboard");
        }, 500); // Redirect after a brief delay to ensure smooth user experience
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
    width: wp('100%'), // Full screen width
    height: hp('100%'), // Full screen height
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: wp('5%'), // 5% of screen width
    paddingTop: hp('5%'), // 5% of screen height
  },
  topSection: {
    width: wp('100%'),
    alignItems: "center",
    marginBottom: hp('2%'),
  },
  illustration: {
    width: wp('70%'),
    height: hp('25%'), // Adjust height proportionally
    resizeMode: "contain",
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: wp('7%'), // Scales based on screen width
    color: "#4874A6",
    fontWeight: "bold",
    textAlign: "left",
    marginTop: hp('2%'),
    marginBottom: hp('3%'),
  },
  input: {
    width: wp('90%'), // Takes up 90% of screen width
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: hp('2%'), // Scales padding
    marginVertical: hp('1%'),
    borderWidth: 1,
    borderColor: "#4874A6",
    fontSize: wp('4%'),
    textAlign: "left",
  },
  forgotPassword: {
    color: "#4874A6",
    fontSize: wp('3.5%'),
    textAlign: "center",
    marginBottom: hp('2%'),
  },
  buttonContainer: {
    width: wp('90%'),
    alignItems: "center",
    marginTop: hp('2%'),
  },
  button: {
    width: wp('40%'),
    backgroundColor: "#80A3CC",
    borderRadius: 10,
    paddingVertical: hp('2%'),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp('4%'),
    fontWeight: "bold",
  },
});

export default LoginAdmin;
