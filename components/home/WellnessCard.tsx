import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { ArrowRight, TrendingUp, Flame } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { router } from 'expo-router';

export default function WellnessCard() {
  const glowScale = useSharedValue(1);

  React.useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.container}>
      {/* Background gradients via absolute views */}
      <View style={styles.cardBackground} />
      
      {/* Decorative Orbs */}
      <Animated.View style={[styles.orb1, animatedGlowStyle]} />
      <View style={styles.orb2} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.tagLabel}>WELLNESS INSIGHTS</Text>
          <View style={styles.iconWrapper}>
            <TrendingUp size={16} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>Your inner weather.</Text>
        <Text style={styles.subtitle}>
          Track patterns, see your streak, and notice what shifts.
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Pressable 
            style={({ pressed }) => [
              styles.viewButton,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
            ]}
            onPress={() => router.push('/(tabs)/wellness')}
          >
            <Text style={styles.viewButtonText}>View Insights</Text>
            <ArrowRight size={16} color="#1E3330" strokeWidth={2.5} />
          </Pressable>

          <View style={styles.streakBadge}>
            <Flame size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.streakText}>7-day streak</Text>
          </View>
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
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E3330', // A dark teal/green
  },
  orb1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2A524D',
  },
  orb2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(235, 185, 80, 0.05)', // Subtle gold
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
    backgroundColor: 'rgba(42, 82, 77, 0.8)',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  viewButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3330',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 6,
  },
  streakText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  }
});
