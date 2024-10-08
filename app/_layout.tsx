import { AuthContext, AuthProvider } from '@/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
SplashScreen.preventAutoHideAsync();


function RootLayoutComponent() {
  const { firstLogin } = useContext(AuthContext);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
    {firstLogin == false? (
      <Stack.Screen name="(auth)/FirstScren" options={{ headerShown: false }} />
    ) : (
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    )}
  </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
    <AuthProvider>
      <RootLayoutComponent />
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
