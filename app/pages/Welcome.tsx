import { router, Stack } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { ParticleOverlay } from '../../components/ParticleOverlay';
import { theme } from '../../constants/theme';
import o1 from './images/onboarding-slide1.png';
import o2 from './images/onboarding-slide2.png';
import o3 from './images/onboarding-slide3.png';
const { width } = Dimensions.get('window');

const slides = [
  {
    headline: 'Your mind deserves\na place to rest',
    sub: 'Nirvaha helps you understand what you feel —\nnot just reduce stress.',
    image: o1, // Mock image
  },
  {
    headline: 'Nirvaha AI, therapy &\nancient wisdom — united',
    sub: 'Get personalized guidance through AI intelligence,\nreflection, meditation, and human support.',
    image: o2, // Mock image
  },
  {
    headline: 'Begin your\ninner journey',
    sub: 'Step into a personalized space for\nclarity, healing, and balance.',
    image: o3, // Mock image
  },
];

const SWIPE_THRESHOLD = 50;

export default function WelcomeScreen() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const isLast = current === slides.length - 1;

  const goTo = useCallback((index: number, dir: number) => {
    if (index < 0 || index >= slides.length) return;
    setDirection(dir);
    setCurrent(index);
  }, []);

  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD && current < slides.length - 1) {
        runOnJS(goTo)(current + 1, 1);
      } else if (e.translationX > SWIPE_THRESHOLD && current > 0) {
        runOnJS(goTo)(current - 1, -1);
      }
    });

  // Background gradient via animated views (simulating radial/linear gradients)
  const glowScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.2);

  React.useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  // Entering/Exiting animations
  const enteringAnimation = direction > 0 ? FadeInRight.duration(400) : FadeInLeft.duration(400);
  const exitingAnimation = direction > 0 ? FadeOutLeft.duration(400) : FadeOutRight.duration(400);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Background Gradient Simulator */}
      <View style={styles.backgroundGradient} />

      {/* Ambient Orbs */}
      <View style={[styles.ambientOrb, { top: '5%', right: '-8%', backgroundColor: theme.colors.healingGreen }]} />
      <View style={[styles.ambientOrb, { bottom: '12%', left: '-5%', backgroundColor: theme.colors.gold, width: 200, height: 200 }]} />

      <ParticleOverlay />

      {/* Skip Button */}
      {!isLast && (
        <Animated.View entering={FadeIn} style={styles.skipContainerTop}>
          <Pressable onPress={() => router.replace('/pages/Auth')} style={styles.skipButtonTop}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Main Content Area */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.mainContent}>
          <Animated.View
            key={current}
            entering={enteringAnimation}
            exiting={exitingAnimation}
            style={styles.slideContainer}
          >
            <View style={styles.imageWrapper}>
              <Animated.View style={[styles.glowBackdrop, animatedGlowStyle]} />
              <Animated.Image
                source={slides[current].image}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.headline}>{slides[current].headline}</Text>
            <Text style={styles.subtext}>{slides[current].sub}</Text>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i, i > current ? 1 : -1)}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: i === current ? 24 : 8,
                    backgroundColor: i === current ? theme.colors.healingGreen : theme.colors.border,
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        {/* Navigation Actions */}
        {isLast ? (
          <View style={styles.finalActionsContainer}>
            <Animated.View entering={FadeIn.delay(100)}>
              <Pressable style={styles.btnPrimary} onPress={() => router.replace('/pages/Auth')}>
                <Text style={styles.btnPrimaryText}>Create Account</Text>
              </Pressable>
            </Animated.View>

          </View>
        ) : (
          <View style={styles.navRow}>
            <Pressable onPress={() => router.replace('/pages/Auth')}>
              <Text style={styles.skipTextBottom}>Skip</Text>
            </Pressable>

            <Pressable
              style={styles.nextButton}
              onPress={() => goTo(current + 1, 1)}
            >
              <ArrowRight size={24} color={theme.colors.primaryForeground} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background, // Can be improved with linear-gradient if needed
  },
  ambientOrb: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.15,
    filter: 'blur(50px)', // Blur works on web/iOS, maybe limited on Android without SVG
  },
  skipContainerTop: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 20,
  },
  skipButtonTop: {
    backgroundColor: 'rgba(248, 246, 240, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.foreground,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  slideContainer: {
    alignItems: 'center',
    width: width - 64,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 40,
    width: 224,
    height: 224,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBackdrop: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.gold,
  },
  illustration: {
    width: 224,
    height: 224,
    zIndex: 2,
  },
  headline: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtext: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  bottomSection: {
    zIndex: 10,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipTextBottom: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  finalActionsContainer: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: theme.typography.bodyMedium,
    color: theme.colors.primaryForeground,
    fontSize: 16,
  },
  btnGuest: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnGuestText: {
    fontFamily: theme.typography.bodyMedium,
    color: theme.colors.foreground,
    fontSize: 16,
  },
});
