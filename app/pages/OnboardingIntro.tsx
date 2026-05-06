import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

// Make sure to place the actual images in this directory
import logoImg from './images/nirvaha-logo.png';
import introImg from './images/onboarding-slide1.png'; // Fallback to slide1 until meditation img is available

const { width } = Dimensions.get('window');

export default function OnboardingIntro() {
  // Continuous Scale Animation for Logo
  const logoScale = useSharedValue(1);
  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Continuous Float Animation for Illustration
  const illustrationY = useSharedValue(0);
  useEffect(() => {
    illustrationY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedIllustrationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: illustrationY.value }],
  }));

  // Continuous Pulse Glow Animation
  const glowOpacity = useSharedValue(0.6);
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Gradient Simulator */}
      <View style={styles.backgroundGradient} />

      <Animated.View
        entering={FadeInUp.duration(600)}
        exiting={FadeOutUp.duration(600)}
        style={styles.contentWrapper}
      >
        {/* Logo */}
        <Animated.View
          entering={FadeInUp.duration(800).delay(100)}
          style={[styles.logoContainer, animatedLogoStyle]}
        >
          <Image source={logoImg} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* Illustration with Glow */}
        <Animated.View
          entering={FadeInUp.duration(1000).delay(200)}
          style={styles.illustrationContainer}
        >
          <Animated.View style={[styles.glow, animatedGlowStyle]} />
          <Animated.Image
            source={introImg}
            style={[styles.illustration, animatedIllustrationStyle]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Content */}
        <Animated.Text
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.heading}
        >
          Hi there!
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(500).delay(600)}
          style={styles.subtext}
        >
          Before you start, we have
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(500).delay(700)}
          style={[styles.subtext, { marginBottom: 40 }]}
        >
          just a few questions
        </Animated.Text>

        {/* Big Presentable Button */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(1000)}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Pressable
            style={({ pressed }) => [
              styles.beginButton,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
            ]}
            onPress={() => {
              router.push('/pages/Onboarding');
            }}
          >
            <Text style={styles.beginButtonText}>BEGIN</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Match dark theme if needed, or use specific color
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C2E2A', // Darkish background as per the web style white text
  },
  contentWrapper: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    height: 56,
    width: 140,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 24,
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 999,
    backgroundColor: 'rgba(235, 185, 80, 0.4)', // gold/yellowish glow
    filter: 'blur(30px)',
  },
  illustration: {
    width: 200,
    height: 200,
    zIndex: 10,
  },
  heading: {
    fontFamily: theme.typography.display,
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  subtext: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textAlign: 'center',
  },
  beginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  beginButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#1C2E2A', // Dark text on light button
    letterSpacing: 1.5,
  },
});
