import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, BackHandler } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { Easing, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { generateWisdomSelfie, getCompressedBase64Image } from '../../api/replicateClient';
import { detectBeard } from '../../api/client';
import { theme } from '../../constants/theme';
import Toast from 'react-native-toast-message';

export default function WisdomSelfieProcessing() {
  const { selfieUri, templateId } = useLocalSearchParams<{ selfieUri: string, templateId: string }>();
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    // Start loader animations
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Disable hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const processImage = async () => {
      try {
        const base64Image = await getCompressedBase64Image(selfieUri);
        const hasBeard = await detectBeard(base64Image);
        console.log('Beard detected:', hasBeard);

        let templateUri: any = null;
        if (hasBeard) {
          switch (templateId) {
            case 'shiva': templateUri = null; break;
            case 'krishna': templateUri = null; break;
            case 'rama': templateUri = null; break;
            case 'ganesh': templateUri = null; break;
            default: throw new Error("Unknown template");
          }
        } else {
          switch (templateId) {
            case 'shiva': templateUri = null; break;
            case 'krishna': templateUri = null; break;
            case 'rama': templateUri = null; break;
            case 'ganesh': templateUri = null; break;
            default: throw new Error("Unknown template");
          }
        }

        const resultUrl = await generateWisdomSelfie(templateUri, selfieUri);

        // Navigate to result
        router.replace({
          pathname: '/wisdom-selfie/result',
          params: { resultUrl }
        });

      } catch (err: any) {
        console.log('Caught Error in processImage:', err);
        setError(err.message || 'An unexpected error occurred.');
        Toast.show({ type: 'error', text1: 'Generation Failed', text2: err.message });
        setTimeout(() => router.back(), 3000);
      }
    };

    processImage();

    return () => backHandler.remove();
  }, []);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <SafeAreaView style={styles.container} pointerEvents="none">
      <LinearGradient colors={['#0F161A', '#0A0A0A']} style={StyleSheet.absoluteFillObject} />

      <View style={styles.content}>
        {/* Animated Loader Orbs */}
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.orb1, animatedOrbStyle]} />
          <Animated.View style={[styles.orb2, animatedOrbStyle]} />
          <Animated.View style={[styles.orb3, animatedOrbStyle]} />
        </View>

        <Animated.View style={[styles.textContainer, animatedTextStyle]}>
          <Text style={styles.title}>Generating selfie...</Text>
          <Text style={styles.subtitle}>
            Breathe deeply. Aligning your essence with ancient wisdom.
          </Text>
        </Animated.View>

        {error && (
          <Text style={styles.errorText}>Returning you safely...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loaderContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  orb1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(180, 140, 60, 0.4)',
    borderStyle: 'dashed',
  },
  orb2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(50, 140, 140, 0.6)',
    borderStyle: 'dotted',
  },
  orb3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '700',
    color: '#EFEFEF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(180, 140, 60, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    marginTop: 24,
    color: theme.colors.error,
    fontFamily: theme.typography.body,
    fontSize: 14,
  }
});
