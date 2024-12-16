import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For eye icon
import useConfig from "../backend/../hooks/useConfig";

const ForgotPassword = () => {
  const { apiBaseUrl } = useConfig();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Tracks the current step

  console.log("Current Step:", step); // Debugging to track the current step

  // Handle Send Code
  const handleSendCode = async () => {
    console.log("Email:", email);
    try {
      const response = await fetch(`${apiBaseUrl}/forgot-password/sendcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert("Success", "Verification code sent to your email.");
        setStep(2); // Move to Step 2
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error in handleSendCode:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Handle Verify Code
  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    console.log("Verifying Code:", code);
    if (!code) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        Alert.alert("Success", "Code verified.");
        setStep(3); // Move to reset password step
      } else {
        Alert.alert("Error", "Invalid verification code.");
      }
    } catch (error) {
      console.error("Error in handleVerifyCode:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Handle Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        Alert.alert("Success", "Password reset successfully.");
        setStep(1); // Reset to Step 1
      } else {
        Alert.alert("Error", "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error in handleResetPassword:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1
          ? "Forgot your password"
          : step === 2
          ? "Enter OTP Code"
          : "Reset Password"}
      </Text>

      {/* Step 1: Enter Email */}
      {step === 1 && (
        <>
          <Text style={styles.subtitle}>
            Please enter the email address you'd like your password reset information sent to.
          </Text>
          <Text style={styles.inputLabel}>Enter email address</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#6c757d"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Request reset link</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <>
          <Text style={styles.subtitle}>Enter the verification code sent to your email.</Text>
          <View style={styles.otpContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => {
                  const newCode = [...verificationCode];
                  newCode[index] = text;
                  setVerificationCode(newCode);
                }}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <>
          <Text style={styles.inputLabel}>Enter new password</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#6c757d"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#6c757d"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 26, fontWeight: "bold", color: "#212529", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#6c757d", marginBottom: 30, lineHeight: 22 },
  inputLabel: { fontSize: 14, color: "#212529", marginBottom: 5, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#212529",
    marginBottom: 15,
  },
  button: { backgroundColor: "#ADC1D8", padding: 15, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  otpBox: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#ffffff",
  },
  passwordInput: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ced4da", borderRadius: 6, marginBottom: 15 },
});

export default ForgotPassword;
