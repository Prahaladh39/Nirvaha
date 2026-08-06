import { Stack } from 'expo-router';

export default function SoundHealingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="category/[categoryId]" options={{ headerShown: false }} />
      <Stack.Screen name="journey/[journeyId]" options={{ headerShown: false }} />
    </Stack>
  );
}
