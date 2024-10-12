// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
  name?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  address?: string;
  weight?: number;
  height?: number;
}

interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => Promise<void>; // Update to allow setting user info
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode; // Specify the type for children prop
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(null);

  // Function to load user info from AsyncStorage
  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const parsedUserInfo: UserInfo = JSON.parse(userInfoString);
        setUserInfoState(parsedUserInfo);
      }
    } catch (error) {
      console.error('Failed to load user information:', error);
    }
  };

  // Function to save user info to AsyncStorage and update state
  const setUserInfo = async (info: UserInfo | null) => {
    try {
      if (info) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(info));
      } else {
        await AsyncStorage.removeItem('userInfo');
      }
      setUserInfoState(info); // Update state after saving
      loadUserInfo(); // Fetch updated user info
    } catch (error) {
      console.error('Failed to save user information:', error);
    }
  };

  // Load user info on mount
  useEffect(() => {
    loadUserInfo();
  }, []);

  // Return context provider with userInfo and setUserInfo function
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
