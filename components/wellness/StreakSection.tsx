import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Flame, CheckCircle } from 'lucide-react-native';
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

interface StreakSectionProps {
  moodLog: MoodEntry[];
}

export default function StreakSection({ moodLog }: StreakSectionProps) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  const shiftedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  monday.setDate(now.getDate() - shiftedDay);
  monday.setHours(0, 0, 0, 0);

  const weekMoods = moodLog.filter((e) => new Date(e.timestamp) >= monday);
  
  // Unique days this week
  const uniqueDays = new Set(
    weekMoods.map((e) => new Date(e.timestamp).toDateString())
  ).size;

  // Calm streak (consecutive recent entries >= 3.5)
  const scores = weekMoods.map((e) => moodScores[e.mood.toLowerCase()] || 3);
  let calmStreak = 0;
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i] >= 3.5) calmStreak++;
    else break;
  }

  if (weekMoods.length === 0) return null;

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.container}>
      <View style={styles.streakItem}>
        <Flame size={16} color={theme.colors.primary} />
        <Text style={styles.text}>
          {uniqueDays} day{uniqueDays !== 1 ? 's' : ''} checked in this week
        </Text>
      </View>
      
      {calmStreak >= 2 && (
        <View style={styles.streakItem}>
          <CheckCircle size={16} color={theme.colors.primary} />
          <Text style={styles.text}>
            {calmStreak} calmer check-ins in a row
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 12,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  text: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  }
});
