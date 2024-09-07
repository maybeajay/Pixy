import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import OnBoarding from '@/components/OnBoarding'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthContext, AuthProvider } from '@/context/AuthContext'
import { router, useRootNavigationState } from 'expo-router'
import 'react-native-reanimated'
type Props = {}

const index = (props: Props) => {
  const { firstLogin } = useContext(AuthContext);
  const rootNavigationState = useRootNavigationState();
  if (!rootNavigationState?.key) return null;
  return (
    <AuthProvider>
    <StatusBar style='dark'/>
    {
      firstLogin ? router.replace("/welcome") : router.replace("/(auth)/FirstScren")
    }
    </AuthProvider>
  )
}

export default index