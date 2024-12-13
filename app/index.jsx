import React from "react";
import {useEffect} from "react";

import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; 
import ScreenWrapper from "../components/ScreenWrapper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const StartScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.outercontainer}>
      <ScreenWrapper bg="#80A3CC" style={styles.screenWrapper}>
        <LinearGradient colors={["#80A3CC", "#91BEE3"]} style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>
            <Text style={styles.smartText}>SMART</Text>
            {"\n"}
            <Text style={styles.careText}>CARE</Text>
          </Text>

          {/* Image Container */}
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/gear.png")}
              style={styles.backgroundGear}
            />
            <Image
              source={require("@/assets/images/left.png")}
              style={styles.image1}
            />
            <Image
              source={require("@/assets/images/watch.png")}
              style={styles.watch}
            />
            <Image
              source={require("@/assets/images/right.png")}
              style={styles.image2}
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.buttonAdmin}
            onPress={() => router.push("/LoginAdmin")}
          >
            <Text style={styles.buttonText}>Login as Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonUser}
            onPress={() => router.push("/LoginUser")}
          >
            <Text style={styles.buttonText}>Login as User</Text>
          </TouchableOpacity>

          {/* Small Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => router.push("/FamilyRegistration")}>
              <Text style={styles.linkText}>Register as Family</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/CaregiverRegistration")}>
              <Text style={styles.linkText}>Register as Caregiver</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  outercontainer: {
    height: hp(100),
    width: wp(100),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  imageContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(5),
  },
  backgroundGear: {
    position: "absolute",
    width: wp(100),
    height: hp(50),
    resizeMode: "contain",
    top: -hp(10),
    right: wp(10),
  },
  image1: {
    width: wp(30),
    height: hp(40),
    resizeMode: "contain",
    left: wp(5),
  },
  image2: {
    width: wp(25),
    height: hp(40),
    right: wp(5),
    resizeMode: "contain",
  },
  watch: {
    width: wp(35),
    height: hp(20),
    resizeMode: "contain",
    marginHorizontal: wp(2),
  },
  buttonAdmin: {
    width: "80%",
    backgroundColor: "#80A3CC",
    borderRadius: wp(5),
    paddingVertical: hp(1.5),
    marginVertical: hp(1),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  buttonUser: {
    width: "80%",
    backgroundColor: "#91BEE3",
    borderRadius: wp(5),
    paddingVertical: hp(1.5),
    marginVertical: hp(1),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: wp(10),
    textAlign: "center",
    paddingBottom: hp(3),
  },
  smartText: {
    fontWeight: "bold",
    fontSize: wp(12),
    color: "#3768AF",
  },
  careText: {
    fontWeight: "bold",
    fontSize: wp(12),
    color: "#FFFFFF",
  },
  linksContainer: {
    marginTop: hp(3),
    alignItems: "center",
  },
  linkText: {
    fontSize: wp(3.5),
    color: "#FFFFFF",
    textDecorationLine: "underline",
    marginVertical: hp(0.5),
  },
});

export default StartScreen;
