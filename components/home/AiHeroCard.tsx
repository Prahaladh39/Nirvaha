import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { router } from 'expo-router';

export default function AiHeroCard() {
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
    <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.container}>
      {/* Background gradients via absolute views */}
      <View style={styles.cardBackground} />
      
      {/* Decorative Orbs */}
      <Animated.View style={[styles.orb1, animatedGlowStyle]} />
      <View style={styles.orb2} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.tagLabel}>INNER GUIDE</Text>
          <View style={styles.iconWrapper}>
            <Sparkles size={16} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        {/* Text Content */}
        <Text style={styles.title}>Ask Nirvaha AI.</Text>
        <Text style={styles.subtitle}>
          Guidance rooted in ancient wisdom and therapeutic practices.
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Pressable 
            style={({ pressed }) => [
              styles.viewButton,
              pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
            ]}
            onPress={() => router.push('/(tabs)/chat' as any)}
          >
            <Text style={styles.viewButtonText}>Chat with Nirvaha</Text>
            <ArrowRight size={16} color="#000000" strokeWidth={2.5} />
          </Pressable>

          <View style={styles.streakBadge}>
            <MessageCircle size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.streakText}>Active now</Text>
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
    backgroundColor: '#2F3E35', // Slightly different green/grey than wellness
  },
  orb1: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(235, 185, 80, 0.15)', // Gold glow
  },
  orb2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    maxWidth: '85%',
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
    backgroundColor: theme.colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  viewButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
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
