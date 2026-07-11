import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { useMoodLog } from '../../hooks/useMoodLog';

import MoodChart from '../../components/wellness/MoodChart';
import WeeklyInsight from '../../components/wellness/WeeklyInsight';
import StreakSection from '../../components/wellness/StreakSection';
import WellnessActions from '../../components/wellness/WellnessActions';

const moodScores: Record<string, number> = {
  happy: 5, joyful: 5, excited: 5,
  grateful: 5, serene: 4.5,
  calm: 4, relax: 4,
  focus: 3.5, sensitive: 3, confused: 3,
  tired: 2, bored: 2,
  sad: 1.5, frustrated: 1.5, stressed: 1.5, angry: 1.5, insecure: 1.5, guilty: 1.5, hurt: 1.5,
  anxious: 1,
};

export default function WellnessScreen() {
  const { moodLog, loading } = useMoodLog();

  const avgMood = useMemo(() => {
    if (moodLog.length === 0) return 3;
    const scores = moodLog.map((e) => moodScores[e.mood.toLowerCase()] || 3);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [moodLog]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScreenContainer
      scrollable
      fullBleed
      hasBottomTab
      statusBarStyle="light"
      style={styles.container}
      scrollContentStyle={styles.scrollContent}
      background={
        <>
          {/* Ambient Orbs */}
          <View style={[styles.ambientOrb, { top: '5%', right: '-10%', backgroundColor: theme.colors.healingGreen, width: 240, height: 240 }]} />
          <View style={[styles.ambientOrb, { bottom: '30%', left: '-10%', backgroundColor: theme.colors.gold, width: 180, height: 180 }]} />
        </>
      }
    >
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.title}>Wellness</Text>
          <Text style={styles.subtitle}>Your emotional journey this week</Text>
        </Animated.View>

        {/* Mood Chart */}
        <MoodChart moodLog={moodLog} />

        {/* Weekly Insight + Pattern Cards */}
        <WeeklyInsight moodLog={moodLog} />

        {/* Action Recommendations */}
        <WellnessActions avgMood={avgMood} />

        {/* Streaks */}
        <StreakSection moodLog={moodLog} />

        {/* Journey Continuity */}
        <Animated.View entering={FadeIn.duration(600).delay(600)} style={styles.footer}>
          <Text style={styles.footerQuote}>{"\"Patterns are becoming clearer\""}</Text>
          <Text style={styles.footerSub}>Small check-ins create meaningful insight</Text>
        </Animated.View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 120,
    opacity: 0.15,
    filter: 'blur(50px)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    // Spacing at bottom calculated dynamically by ScreenContainer
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerQuote: {
    fontFamily: theme.typography.display,
    fontSize: 15,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  footerSub: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  }
});
