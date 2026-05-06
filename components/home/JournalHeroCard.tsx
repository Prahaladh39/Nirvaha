import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { BookOpen, ArrowRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { router } from 'expo-router';

export default function JournalHeroCard() {
  const glowScale = useSharedValue(1);

  React.useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.container}>
      <View style={styles.cardBackground} />
      
      <Animated.View style={[styles.orb1, animatedGlowStyle]} />
      <View style={styles.orb2} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.tagLabel}>REFLECTION</Text>
          <View style={styles.iconWrapper}>
            <BookOpen size={16} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        <Text style={styles.title}>Clear your mind.</Text>
        <Text style={styles.subtitle}>
          Journal your thoughts. Free your mental space securely and privately.
        </Text>

        <View style={styles.actionRow}>
          <Pressable 
            style={({ pressed }) => [
              styles.viewButton,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
            ]}
            onPress={() => router.push('/(tabs)/journal')}
          >
            <Text style={styles.viewButtonText}>Write Now</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 220,
    shadowColor: '#120f18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#352D26', // Warm brownish dark tone
  },
  orb1: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 120, 100, 0.08)', 
  },
  orb2: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagLabel: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '80%',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  viewButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});
