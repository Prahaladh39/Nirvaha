import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import Toast from 'react-native-toast-message';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pages" options={{ headerShown: false }} />
        <Stack.Screen name="sound-healing" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </GestureHandlerRootView>
  );
}
