import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  token: string;
  userId: string;
  type: string;
} | null; // Allow null for unauthenticated users

const useAuth = () => {
  const [user, setUser] = useState<User>(null); // Explicitly type the state
  const [loading, setLoading] = useState<boolean>(true); // Loading is a boolean

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = (await AsyncStorage.getItem('authToken')) || ''; // Default to empty string
        const userId = (await AsyncStorage.getItem('userId')) || ''; // Default to empty string
        const type = (await AsyncStorage.getItem('type')) || ''; // Default to empty string
        console.log("INSIDE THE HOOK");
        console.log(token);
        console.log(userId);
        console.log(type);

        if (token && userId && type) {
          setUser({ token, userId, type }); // Match the `User` type
        } else {
          setUser(null); // No user found
        }
      } catch (error) {
        console.error('Error retrieving user from AsyncStorage:', error);
        setUser(null); // Handle errors by resetting user
      } finally {
        setLoading(false); // Set loading to false after completion
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;
