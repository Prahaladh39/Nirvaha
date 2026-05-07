import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, BookOpen, Activity } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMoodLog } from '../../hooks/useMoodLog';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default function PersonalStats() {
  const { moodLog } = useMoodLog();
  const [journalCount, setJournalCount] = useState(0);
  const checkIns = moodLog.length;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/journals`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJournalCount(snapshot.size);
    });

    return unsubscribe;
  }, []);

  const stats = [
    { label: "Reflections", value: String(checkIns), icon: Heart },
    { label: "Journal entries", value: String(journalCount), icon: BookOpen },
    { label: "Sessions", value: String(Math.max(1, checkIns + journalCount)), icon: Activity },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(250)}
      style={styles.container}
    >
      <View style={styles.grid}>
        {stats.map((stat, i) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={['rgba(50, 140, 140, 0.12)', 'rgba(235, 185, 80, 0.1)']}
                style={StyleSheet.absoluteFill}
              />
              <stat.icon size={14} color={theme.colors.primary} />
            </View>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  value: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
