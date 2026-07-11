import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import Toast from 'react-native-toast-message';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ConsentGate from '../components/auth/ConsentGate';

import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * Inner layout that has access to auth context and handles route protection.
 */
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Determine if the current route is in an unauthenticated area
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === 'pages';
    const isIndex = !firstSegment || firstSegment === 'index';

    if (!user && !inAuthGroup && !isIndex) {
      // User is NOT signed in and is trying to access a protected route.
      // Redirect to the auth screen.
      router.replace('/pages/Auth');
    }
  }, [user, isLoading, segments]);

  return (
    <>
      <ConsentGate>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pages" options={{ headerShown: false }} />
          <Stack.Screen name="sound-healing" options={{ headerShown: false }} />
          <Stack.Screen name="space" options={{ headerShown: false }} />
          <Stack.Screen name="wisdom-selfie" options={{ headerShown: false }} />
          <Stack.Screen name="ancient-character-quiz" options={{ headerShown: false }} />
          <Stack.Screen name="temple-of-balance" options={{ headerShown: false }} />
        </Stack>
      </ConsentGate>
      <StatusBar style="auto" />
      <Toast />
    </>
  );
}

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
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
