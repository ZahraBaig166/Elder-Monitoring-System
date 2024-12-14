import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const UserContext = createContext();

// Provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store the user information (token + userId)
  const [loading, setLoading] = useState(true);  // Show loading until token is checked

  useEffect(() => {
    // Check if there's a stored token and userId when the app starts
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');  // Retrieve the userId
      const type = await AsyncStorage.getItem('type');

      if (token && userId) {
        setUser({ token, userId, type});  // Set both token and userId
      }
      setLoading(false);  // Finished checking, stop loading
    };

    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');  // Remove the token from AsyncStorage
    await AsyncStorage.removeItem('userId');  // Remove the userId from AsyncStorage
    setUser(null);  // Clear the user state
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
