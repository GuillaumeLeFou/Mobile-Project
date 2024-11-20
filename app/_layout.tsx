import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="exercise" />
      <Stack.Screen name="doExercise" />
      {/* <Stack.Screen name="doChallenge" /> */}
      {/* <Stack.Screen name="challenge" /> */}
    </Stack>
  );
}
