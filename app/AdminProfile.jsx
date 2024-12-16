import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavBar from '../components/NavBar'; // Include NavBar Component

const AdminProfile = () => {
  const [showPassword, setShowPassword] = useState(false);

  const adminData = {
    username: 'Admin',
    email: 'admin123@gmail.com',
    password: 'adminpass123',
    profileImage:
      'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: adminData.profileImage }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileTitle}>Admin Profile</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#6c757d" style={styles.icon} />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.inputField}
              value={adminData.email}
              editable={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#6c757d" style={styles.icon} />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.inputField}
              value={adminData.password}
              secureTextEntry={!showPassword}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* NavBar Component */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafe',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 80, // Ensure space for the navbar
  },
  header: {
    backgroundColor: '#a8c4e1',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingVertical: 40,
    alignItems: 'center',
  },
  profileImageContainer: {
    backgroundColor: '#d9e3f0',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  inputField: {
    flex: 2,
    fontSize: 16,
    color: '#495057',
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
});

export default AdminProfile;
