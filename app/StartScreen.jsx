import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const StartScreen = () => {
  return (
    <LinearGradient
      colors={["#80A3CC", "#91BEE3"]} // Define the gradient colors
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
          source={require("@/assets/images/gear.png")} // Gear background
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
      <TouchableOpacity style={styles.buttonAdmin}>
        <Text style={styles.buttonText}>Login as Admin</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonUser}>
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#80A3CC", // Match the background color from the original design
  },
  imageContainer: {
    position: "relative", // Allows overlapping of images
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  backgroundGear: {
    position: "absolute", // Places the gear behind other elements
    width: 400, // Adjust to match the design
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
    width: 160, // Increased size of the watch
    height: 180,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  buttonAdmin: {
    width: "80%",
    backgroundColor: "#80A3CC", // Button background color
    borderRadius: 25, // Rounded corners
    paddingVertical: 12, // Vertical padding
    marginVertical: 10, // Space between buttons
    alignItems: "center", // Center text inside the button
    shadowColor: "#000", // Shadow properties
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for shadow on Android
    borderWidth: 2, // Adds border width
    borderColor: "#FFFFFF", // Sets border color to white
  },
  buttonUser: {
    width: "80%",
    backgroundColor: "#91BEE3", // Button background color
    borderRadius: 25, // Rounded corners
    paddingVertical: 12, // Vertical padding
    marginVertical: 10, // Space between buttons
    alignItems: "center", // Center text inside the button
    shadowColor: "#000", // Shadow properties
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Elevation for shadow on Android
    borderWidth: 2, // Adds border width
    borderColor: "#FFFFFF", // Sets border color to white
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Match button text color
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    paddingBottom: 30,
  },
  smartText: {
    fontWeight: "bold",
    fontSize: 48, // Adjust size to match the design
    color: "#3768AF", // Blue color for "SMART"
  },
  careText: {
    fontWeight: "bold",
    fontSize: 48, // Adjust size to match the design
    color: "#FFFFFF", // White color for "CARE"
  },
});

export default StartScreen;
