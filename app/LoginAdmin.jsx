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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import useConfig from "../backend/../hooks/useConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library

const LoginAdmin = () => {
  const { apiBaseUrl } = useConfig();
  const router = useRouter();

  // States for email, password, and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);

      const response = await fetch(`${apiBaseUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        const token = data.token;
        console.log("Token:", token);

        try {
          await AsyncStorage.setItem("authToken", String(token));
          await AsyncStorage.setItem("userId", String("1"));
          await AsyncStorage.setItem("type", String("admin"));
          console.log("Saved successfully");
        } catch (error) {
          console.error("AsyncStorage Error:", error);
        }

        console.log("Token and UserId saved, navigating...");
        setTimeout(() => {
          router.replace("/Dashboard");
        }, 500);
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred while logging in. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/rectangles1.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={require("../assets/images/login.png")}
            style={styles.illustration}
          />
        </View>

        <Text style={styles.title}>Hello there,</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#4874A6"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#4874A6"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? "eye" : "eye-slash"}
              size={wp(5)}
              color="#4874A6"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

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
    width: wp("90%"),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4874A6",
    marginVertical: hp("1%"),
    paddingHorizontal: wp("2%"),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp("2%"),
    fontSize: wp("4%"),
    color: "#000",
  },
  eyeIcon: {
    marginRight: wp("3%"),
  },
  buttonContainer: {
    width: wp("90%"),
    alignItems: "center",
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

export default LoginAdmin;
