import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Circle, Lock, Play, Sparkles } from 'lucide-react-native';
import BottomNav from '../../../components/navigation/BottomNav';
import SoundPlayer from '../../../components/sound-healing/SoundPlayer';
import { JourneySession, journeySessions, SoundTrack, wellnessPackages } from '../../../constants/soundHealingData';
import { theme } from '../../../constants/theme';

export default function SoundJourneyScreen() {
  const { journeyId } = useLocalSearchParams<{ journeyId?: string }>();
  const [activeTrack, setActiveTrack] = useState<SoundTrack | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [currentDay, setCurrentDay] = useState(1);

  const pkg = useMemo(
    () => wellnessPackages.find((item) => item.id === journeyId),
    [journeyId]
  );
  const sessions = journeySessions[journeyId || ''] || [];

  if (!pkg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Sound journey unavailable</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)/sound-healing' as any)}>
            <Text style={styles.primaryButtonText}>Back to sound healing</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercent = sessions.length === 0 ? 0 : (completedSessions.size / sessions.length) * 100;

  const handlePlaySession = (session: JourneySession) => {
    setCurrentDay(session.day);
    setActiveTrack({
      id: session.id,
      title: session.title,
      description: session.description,
      moodTag: `Day ${session.day}`,
      icon: session.icon,
      duration: session.duration,
      category: session.category,
    });
  };

  const handleClosePlayer = () => {
    if (activeTrack?.id) {
      setCompletedSessions((previous) => new Set([...previous, activeTrack.id]));
    }
    setActiveTrack(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ambientOrb} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/sound-healing' as any)}>
            <ArrowLeft size={18} color="#FFFFFF" />
          </Pressable>
          <Sparkles size={16} color={theme.colors.gold} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(80)} style={styles.heroCard}>
          <LinearGradient colors={pkg.colors} style={StyleSheet.absoluteFill} />
          <View style={styles.heroOrb} />
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroEmoji}>{pkg.icon}</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.title}>{pkg.title}</Text>
              <Text style={styles.purpose}>{pkg.purpose}</Text>
            </View>
          </View>

          <Text style={styles.heroMeta}>
            {pkg.duration} · {sessions.length} sessions · {completedSessions.size} completed
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercent)}% complete</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(160)} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.sessionList}>
            {sessions.map((session) => {
              const isCompleted = completedSessions.has(session.id);
              const isUnlocked = session.day <= currentDay || isCompleted || session.day === 1;

              return (
                <Pressable
                  key={session.id}
                  disabled={!isUnlocked}
                  style={[
                    styles.sessionCard,
                    isCompleted && styles.sessionCardCompleted,
                    !isUnlocked && styles.sessionCardLocked,
                  ]}
                  onPress={() => handlePlaySession(session)}
                >
                  <View style={styles.dayBlock}>
                    <Text style={styles.dayLabel}>Day</Text>
                    <Text style={styles.dayValue}>{session.day}</Text>
                  </View>

                  <View style={styles.statusIcon}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} color={theme.colors.healingGreenLight} />
                    ) : isUnlocked ? (
                      <Circle size={20} color="rgba(255,255,255,0.35)" />
                    ) : (
                      <Lock size={16} color="rgba(255,255,255,0.25)" />
                    )}
                  </View>

                  <View style={styles.sessionCopy}>
                    <View style={styles.sessionTitleRow}>
                      <Text style={styles.sessionEmoji}>{session.icon}</Text>
                      <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
                    </View>
                    <Text style={styles.sessionDescription} numberOfLines={1}>{session.description}</Text>
                    <Text style={styles.sessionDuration}>{session.duration}</Text>
                  </View>

                  {isUnlocked && !isCompleted && (
                    <View style={styles.playButton}>
                      <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={styles.playOffset} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(300)} style={styles.noteCard}>
          <Text style={styles.noteText}>
            This journey is supportive wellness content and is not a substitute for professional medical advice.
          </Text>
        </Animated.View>
      </ScrollView>

      <BottomNav />
      <SoundPlayer
        track={activeTrack}
        playlist={sessions}
        onTrackChange={setActiveTrack}
        onClose={handleClosePlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  ambientOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: '5%',
    right: -70,
    backgroundColor: theme.colors.healingGreen,
    opacity: 0.13,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 130,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroOrb: {
    position: 'absolute',
    top: -34,
    right: -34,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 30,
  },
  heroCopy: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 25,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  purpose: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 3,
    lineHeight: 18,
  },
  heroMeta: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  progressText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'right',
    marginTop: 7,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  sessionList: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sessionCardCompleted: {
    backgroundColor: 'rgba(45,90,76,0.08)',
    borderColor: 'rgba(45,90,76,0.2)',
  },
  sessionCardLocked: {
    opacity: 0.55,
  },
  dayBlock: {
    width: 34,
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.42)',
  },
  dayValue: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIcon: {
    width: 22,
    alignItems: 'center',
  },
  sessionCopy: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionEmoji: {
    fontSize: 16,
  },
  sessionTitle: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sessionDescription: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 3,
  },
  sessionDuration: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 6,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOffset: {
    marginLeft: 2,
  },
  noteCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.14)',
    alignItems: 'center',
  },
  noteText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.56)',
    textAlign: 'center',
    lineHeight: 17,
  },
  missingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingTitle: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryButtonText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  },
});
