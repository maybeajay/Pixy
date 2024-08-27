import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firstLogin, setfirstLogin] = useState("");
  const getValueFromStorage = async ()=>{
    const val = await AsyncStorage.getItem("firstLogin");
    let parsed = JSON.parse(val);
    setfirstLogin(parsed);
  }
  useEffect(()=>{
    getValueFromStorage()
  }, [])
  return (
    <AuthContext.Provider value={{firstLogin, setfirstLogin}}>
      {children}
    </AuthContext.Provider>
  );
};
