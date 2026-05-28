import { Stack } from 'expo-router';

export default function WisdomSelfieLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="processing" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="result" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
