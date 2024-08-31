import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="FirstScren" screenOptions={{headerShown: false}}>
      <Stack.Screen name="FirstScren" options={{ title: "Login" }} />
      <Stack.Screen name="image-modal" options={{ title: "view-image", presentation: "fullScreenModal", animation: "ios" }} />
    </Stack>
  );
}