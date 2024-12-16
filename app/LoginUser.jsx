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
import {useEffect} from "react";
import useConfig from "../backend/../hooks/useConfig";

import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginUser = () => {
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const router = useRouter();
  const { apiBaseUrl, loading, error } = useConfig();

  
console.log("email ",email);
console.log("password",password);
  // Function to handle caregiver login
  const handleLoginCaregiver = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    const response = await fetch(`${apiBaseUrl}/login/caregiver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),  
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.token; // Assuming the token is returned as 'token'
      const userId = data.userId; // Assuming the userId is returned as 'userId'
      const type= data.type;
      console.log("Token:", token);
      console.log("UserId:", userId);
      console.log("Type:",type);

      // Save token and userId in AsyncStorage
      try {
        await AsyncStorage.setItem("authToken", String(token));
        await AsyncStorage.setItem("userId", String(userId));
        await AsyncStorage.setItem("type", String(type));

        console.log("Saved successfully");
      } catch (error) {
        console.error("AsyncStorage Error:", error);
      }
      
      
      // Once AsyncStorage operations are done, navigate
      console.log('Token and UserId saved, navigating...');

      // Redirect based on user type
      router.replace('DoctorDashboard');
    } else {
      Alert.alert("Login Failed", data.message || "Invalid credentials");
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),  
    });


    const data = await response.json();

    if (response.ok) {
      const token = data.token; // Assuming the token is returned as 'token'
      const userId = data.userId; // Assuming the userId is returned as 'userId'
      const type= data.type;
      console.log("Token:", token);
      console.log("UserId:", userId);
      console.log("Type:",type);

      // Save token and userId in AsyncStorage
      try {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userId", String(userId));
        await AsyncStorage.setItem("type",type);

        console.log("Saved successfully");
      } catch (error) {
        console.error("AsyncStorage Error:", error);
      }
      
      
      // Once AsyncStorage operations are done, navigate
      console.log('Token and UserId saved, navigating...');

      // Redirect based on user type
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
    flexDirection: "row",
    justifyContent: "space-evenly",
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
    borderColor: "#000000",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp('4%'),
    fontWeight: "bold",
  },
});


export default LoginUser;
