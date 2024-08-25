import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="login/index" options={{ title: "Login" }} />
    </Stack>
  );
}