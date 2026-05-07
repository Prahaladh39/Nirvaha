import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withDelay, withSpring, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMoodLog } from '../../hooks/useMoodLog';

export default function JourneyCard() {
  const { moodLog } = useMoodLog();
  
  // Calculate streak (unique days)
  const uniqueDays = new Set(
    moodLog
      .map((m: any) => (m.timestamp || "").split("T")[0])
      .filter(Boolean)
  ).size;
  
  const streak = uniqueDays;

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(150)}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['rgba(50, 140, 140, 0.15)', 'rgba(235, 185, 80, 0.1)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Flame size={18} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Your journey</Text>
            <Text style={styles.subtitle}>
              {streak > 0
                ? `${streak} day${streak > 1 ? "s" : ""} of reflection`
                : "Begin your reflection today"}
            </Text>
          </View>
        </View>

        {/* Timeline dots */}
        <View style={styles.timeline}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.duration(300).delay(300 + i * 50)}
              style={[
                styles.dot,
                {
                  backgroundColor: i < streak ? theme.colors.healingGreen : 'rgba(255,255,255,0.1)',
                }
              ]}
            >
              {i < streak && (
                <LinearGradient
                  colors={[theme.colors.healingGreen, theme.colors.healingGreenLight]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}
            </Animated.View>
          ))}
        </View>

        <Text style={styles.footerText}>
          You showed up for yourself{streak > 1 ? " consistently" : ""}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  footerText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
