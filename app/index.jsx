import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import ScreenWrapper from "../components/ScreenWrapper";

const StartScreen = () => {
  const router = useRouter(); // Use router for navigation

  return (
    <ScreenWrapper bg="#80A3CC">
      <LinearGradient
        colors={["#80A3CC", "#91BEE3"]}
        style={styles.container}
      >
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.smartText}>SMART</Text>
          {"\n"}
          <Text style={styles.careText}>CARE</Text>
        </Text>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          {/* Background Gear */}
          <Image
            source={require("@/assets/images/gear.png")}
            style={styles.backgroundGear}
          />
          {/* Left Lady */}
          <Image
            source={require("@/assets/images/left.png")}
            style={styles.image1}
          />
          {/* Watch */}
          <Image
            source={require("@/assets/images/watch.png")}
            style={styles.watch}
          />
          {/* Right Lady */}
          <Image
            source={require("@/assets/images/right.png")}
            style={styles.image2}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.buttonAdmin}
          onPress={() => router.push("/LoginAdmin")} // Navigate to Admin screen
        >
          <Text style={styles.buttonText}>Login as Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonUser}
          onPress={() => router.push("/LoginUser")} // Navigate to User screen
        >
          <Text style={styles.buttonText}>Login as User</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  backgroundGear: {
    position: "absolute",
    width: 400,
    height: 400,
    resizeMode: "contain",
    top: -80,
    right: 65,
  },
  image1: {
    width: 140,
    height: 300,
    resizeMode: "contain",
    left: 38,
  },
  image2: {
    width: 110,
    height: 300,
    right: 15,
    resizeMode: "contain",
  },
  watch: {
    width: 160,
    height: 180,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  buttonAdmin: {
    width: "80%",
    backgroundColor: "#80A3CC",
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  buttonUser: {
    width: "80%",
    backgroundColor: "#91BEE3",
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    paddingBottom: 30,
  },
  smartText: {
    fontWeight: "bold",
    fontSize: 48,
    color: "#3768AF",
  },
  careText: {
    fontWeight: "bold",
    fontSize: 48,
    color: "#FFFFFF",
  },
});

export default StartScreen;
