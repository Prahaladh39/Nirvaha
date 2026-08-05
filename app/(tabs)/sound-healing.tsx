import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Headphones, Play, Repeat, Sparkles } from 'lucide-react-native';
import SoundPlayer from '../../components/sound-healing/SoundPlayer';
import { localSoundTracks, SoundTrack } from '../../constants/soundHealingData';
import { theme } from '../../constants/theme';

export default function SoundHealingScreen() {
  const [activeTrack, setActiveTrack] = useState<SoundTrack | null>(null);
  const featuredTrack = localSoundTracks[0];
  const trackList = localSoundTracks.slice(1);

  return (
    <ScreenContainer statusBarStyle="light" hasBottomTab style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <LinearGradient colors={['#263C36', '#101615', '#0A0A0A']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroGlow} />

          <View style={styles.heroHeader}>
            <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)' as any)}>
              <ArrowLeft size={18} color="#FFFFFF" />
            </Pressable>
            <Sparkles size={16} color={theme.colors.gold} />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Sound Healing Hub</Text>
            <Text style={styles.heroSubtitle}>Find the sound that meets your moment</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(450).delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Featured loop</Text>
            <Pressable style={styles.featuredCard} onPress={() => setActiveTrack(featuredTrack)}>
              <LinearGradient colors={['#4E3A21', '#1E1810']} style={StyleSheet.absoluteFill} />
              <View style={styles.featuredGlow} />
              <View style={styles.featuredTop}>
                <View style={styles.featuredIcon}>
                  <Text style={styles.featuredEmoji}>{featuredTrack.icon}</Text>
                </View>
                <View style={styles.featuredCopy}>
                  <Text style={styles.featuredTitle}>{featuredTrack.title}</Text>
                  <Text style={styles.featuredDescription}>{featuredTrack.description}</Text>
                </View>
              </View>
              <View style={styles.featuredFooter}>
                <View style={styles.loopBadge}>
                  <Repeat size={12} color={theme.colors.gold} />
                  <Text style={styles.loopBadgeText}>Loops by default</Text>
                </View>
                <View style={styles.featuredPlayButton}>
                  <Play size={16} color="#FFFFFF" fill="#FFFFFF" style={styles.playOffset} />
                </View>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(180)} style={styles.section}>
            <View style={styles.libraryHeader}>
              <View>
                <Text style={styles.sectionTitle}>Available sounds</Text>
                <Text style={styles.sectionSubtitle}>{localSoundTracks.length} curated tracks</Text>
              </View>
              <View style={styles.countBadge}>
                <Headphones size={13} color={theme.colors.gold} />
                <Text style={styles.countBadgeText}>{localSoundTracks.length}</Text>
              </View>
            </View>
            <View style={styles.trackList}>
              {trackList.map((track) => (
                <Pressable key={track.id} style={styles.trackCard} onPress={() => setActiveTrack(track)}>
                  <View style={styles.trackIcon}>
                    <Text style={styles.trackEmoji}>{track.icon}</Text>
                  </View>
                  <View style={styles.trackCopy}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackDescription} numberOfLines={1}>{track.description}</Text>
                    <View style={styles.trackMetaRow}>
                      <View style={styles.trackMoodPill}>
                        <Text style={styles.trackMoodText}>{track.moodTag}</Text>
                      </View>
                      <Text style={styles.trackDuration}>{track.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.trackPlayButton}>
                    <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={styles.playOffset} />
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <SoundPlayer
        track={activeTrack}
        playlist={localSoundTracks}
        onTrackChange={setActiveTrack}
        onClose={() => setActiveTrack(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    // Spacing at bottom calculated dynamically by ScreenContainer
  },
  hero: {
    height: 280,
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 28,
  },
  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -40,
    top: 40,
    backgroundColor: 'rgba(212,175,55,0.14)',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    maxWidth: 310,
  },
  heroTitle: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  featuredCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
  },
  featuredGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -28,
    top: -34,
    backgroundColor: 'rgba(212,175,55,0.16)',
  },
  featuredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredEmoji: {
    fontSize: 24,
  },
  featuredCopy: {
    flex: 1,
  },
  featuredTitle: {
    fontFamily: theme.typography.display,
    fontSize: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuredDescription: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 2,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.12)',
  },
  loopBadgeText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: theme.colors.gold,
  },
  featuredPlayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  countBadgeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.gold,
  },
  trackList: {
    gap: 12,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  trackIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(45,90,76,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackEmoji: {
    fontSize: 22,
  },
  trackCopy: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trackDescription: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 3,
  },
  trackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 7,
  },
  trackMoodPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(45,90,76,0.12)',
  },
  trackMoodText: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    color: theme.colors.healingGreenLight,
  },
  trackDuration: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
  },
  trackPlayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOffset: {
    marginLeft: 2,
  },
});
