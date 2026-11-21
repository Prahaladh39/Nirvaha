import React from 'react';
import { Stack } from 'expo-router';

/**
 * Layout configuration for the /events route group.
 * Ensures all child screens render with a consistent dark background
 * and suppresses the default Expo Router native white header.
 */
export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]/register" options={{ headerShown: false }} />
      <Stack.Screen name="[id]/confirmation" options={{ headerShown: false }} />
      <Stack.Screen name="my-bookings" options={{ headerShown: false }} />
    </Stack>
  );
}

