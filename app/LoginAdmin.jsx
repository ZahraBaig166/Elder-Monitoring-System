import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginAdmin = () => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('@/assets/images/background.png')}
        style={styles.image}
      />

      {/* Content Overlay */}
      <View style={styles.contentContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={15} color="#FFF" />
        </TouchableOpacity>

        {/* Login Fields */}
        <Text style={styles.greeting}>Hello there,</Text>
        <View style={styles.outercontainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter your email" />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outercontainer: {
    marginTop: 70,
  },

  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '85%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  greeting: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 70,
    marginTop: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4874A6',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4874A6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Makes inputs stand out on the background
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4874A6',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4874A6',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
  },
});

export default LoginAdmin;
