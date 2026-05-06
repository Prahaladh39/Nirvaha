import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TrendingUp, Cloud, Sun, Zap } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { MoodEntry } from '../../hooks/useMoodLog';

const moodScores: Record<string, number> = {
  happy: 5, joyful: 5, excited: 5,
  grateful: 5, serene: 4.5,
  calm: 4, relax: 4,
  focus: 3.5, sensitive: 3, confused: 3,
  tired: 2, bored: 2,
  sad: 1.5, frustrated: 1.5, stressed: 1.5, angry: 1.5, insecure: 1.5, guilty: 1.5, hurt: 1.5,
  anxious: 1,
};

interface WeeklyInsightProps {
  moodLog: MoodEntry[];
}

export default function WeeklyInsight({ moodLog }: WeeklyInsightProps) {
  const insight = useMemo(() => {
    if (moodLog.length === 0) return null;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    const shiftedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(now.getDate() - shiftedDay);
    monday.setHours(0, 0, 0, 0);

    const weekMoods = moodLog.filter((e) => new Date(e.timestamp) >= monday);
    if (weekMoods.length === 0) return null;

    const scores = weekMoods.map((e) => moodScores[e.mood.toLowerCase()] || 3);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    const moodCounts: Record<string, number> = {};
    weekMoods.forEach((e) => {
      const m = e.mood.toLowerCase();
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    
    const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const calmDays = scores.filter((s) => s >= 4).length;

    let summary = "";
    if (avg >= 4) summary = "A calm and balanced week. You're finding your rhythm 🌿";
    else if (avg >= 3) summary = "A mixed week with moments of calm and challenge. You're navigating well.";
    else if (avg >= 2) summary = "A heavier week emotionally. Remember, awareness is the first step toward balance.";
    else summary = "This week has been challenging. You're doing something powerful just by showing up here 💛";

    return { summary, mostCommon, avg, calmDays, totalEntries: weekMoods.length };
  }, [moodLog]);

  if (!insight) return null;

  const cards = [
    {
      id: 1,
      icon: Sun,
      label: "MOST COMMON",
      value: insight.mostCommon[0].charAt(0).toUpperCase() + insight.mostCommon[0].slice(1),
    },
    {
      id: 2,
      icon: TrendingUp,
      label: "BALANCE",
      value: insight.avg >= 4 ? "Balanced" : insight.avg >= 3 ? "Moderate" : "Needs care",
    },
    {
      id: 3,
      icon: Cloud,
      label: "CALM DAYS",
      value: `${insight.calmDays} days`,
    },
  ];

  return (
    <View style={styles.container}>
      {/* AI Insight */}
      <Animated.View entering={FadeInDown.duration(500).delay(250)} style={styles.insightCard}>
        <View style={styles.iconWrapper}>
          <Zap size={18} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>WEEKLY INSIGHT</Text>
          <Text style={styles.summary}>{insight.summary}</Text>
        </View>
      </Animated.View>

      {/* Pattern Cards */}
      <View style={styles.cardsRow}>
        {cards.map((card, i) => (
          <Animated.View 
            key={card.id}
            entering={FadeInDown.duration(500).delay(300 + i * 100)} 
            style={styles.patternCard}
          >
            <View style={styles.smallIconWrapper}>
              <card.icon size={14} color={theme.colors.primary} />
            </View>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(42, 82, 77, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summary: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  patternCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  smallIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(42, 82, 77, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: theme.typography.display,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardLabel: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    textAlign: 'center',
  }
});
