import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';
import useAuth from "../hooks/useAuth";

const NavBarPatients = () => {
  const { user, loading: authLoading } = useAuth();

  // If the authentication is still loading, show a loading spinner
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#576574" />
      </View>
    );
  }

  // Extract user data once the auth data is available
  const type = user?.type;
  const userId = user?.userId;
  console.log("Retrieved User ID on navbarpatients:", userId);

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navIcon} accessibilityLabel="Dashboard">
        <Icon name="th-large" size={20} color="#576574" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navIcon} accessibilityLabel="Analytics">
        <Icon name="pie-chart" size={20} color="#576574" />
      </TouchableOpacity>

      {userId && (
        <Link
          href={{
            pathname: "/AddQuery",
            params: { userId: userId, type: type },
          }}
          asChild
        >
          <TouchableOpacity style={styles.navCenter} accessibilityLabel="Add Query">
            <View style={styles.centerButton}>
              <Icon name="comment" size={24} color="#576574" />
            </View>
          </TouchableOpacity>
        </Link>
      )}

      <TouchableOpacity style={styles.navIcon} accessibilityLabel="Notifications">
        <Icon name="bell" size={20} color="#576574" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navIcon} accessibilityLabel="Profile">
        <Icon name="user" size={20} color="#576574" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ADC1D8',
    height: 100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 10,
  },
  navIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centerButton: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    position: 'absolute',
    top: -25,
    elevation: 10,
  },
});

export default NavBarPatients;
