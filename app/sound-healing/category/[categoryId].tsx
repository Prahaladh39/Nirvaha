import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Headphones, Play } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../../components/navigation/BottomNav';
import SoundPlayer from '../../../components/sound-healing/SoundPlayer';
import { LAYOUT_TOKENS } from '../../../components/ui/ScreenContainer';
import { categoryTracks, SoundTrack, soundHealingCategories } from '../../../constants/soundHealingData';
import { theme } from '../../../constants/theme';

export default function SoundCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [activeTrack, setActiveTrack] = useState<SoundTrack | null>(null);
  const insets = useSafeAreaInsets();

  const category = useMemo(
    () => soundHealingCategories.find((item) => item.id === categoryId),
    [categoryId]
  );
  const tracks = categoryTracks[categoryId || ''] || [];

  const navBottomOffset = Math.max(LAYOUT_TOKENS.BOTTOM_NAV_MARGIN, insets.bottom + 4);
  const bottomPadding = navBottomOffset + LAYOUT_TOKENS.BOTTOM_NAV_HEIGHT + LAYOUT_TOKENS.GAP_PADDING + 40;

  if (!category) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Sound category unavailable</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)/sound-healing' as any)}>
            <Text style={styles.primaryButtonText}>Back to sound healing</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.ambientOrb, styles.ambientOne]} />
      <View style={[styles.ambientOrb, styles.ambientTwo]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/sound-healing' as any)}>
              <ArrowLeft size={18} color="#FFFFFF" />
            </Pressable>
            <Headphones size={16} color="rgba(255,255,255,0.5)" />
          </View>

          <View style={styles.heroCard}>
            {category.coverImage ? (
              <Image 
                source={typeof category.coverImage === 'number' ? category.coverImage : { uri: category.coverImage }} 
                style={styles.heroImage} 
                contentFit="cover"
                transition={500}
              />
            ) : (
              <LinearGradient colors={category.colors} style={StyleSheet.absoluteFill} />
            )}
            <LinearGradient 
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']} 
              style={styles.heroOverlay} 
            />
            <View style={styles.heroOrb} />
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Text style={styles.heroEmoji}>{category.icon}</Text>
              </View>
              <View style={styles.heroCopy}>
                <Text style={styles.title}>{category.title}</Text>
                <Text style={styles.description}>{category.description}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.moodPill}>
                    <Text style={styles.moodText}>{category.moodTag}</Text>
                  </View>
                  <Text style={styles.trackMeta}>{tracks.length} tracks</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(120)} style={styles.section}>
          <Text style={styles.sectionTitle}>All Tracks</Text>
          <View style={styles.trackList}>
            {tracks.map((track, index) => (
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
                <View style={styles.playButton}>
                  <Play size={16} color="#FFFFFF" fill="#FFFFFF" style={styles.playOffset} />
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(280)} style={styles.tipCard}>
          <Text style={styles.tipText}>For the best experience, use headphones, especially with binaural tones.</Text>
        </Animated.View>
      </ScrollView>

      <BottomNav />
      <SoundPlayer
        track={activeTrack}
        playlist={tracks}
        onTrackChange={setActiveTrack}
        onClose={() => setActiveTrack(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.13,
  },
  ambientOne: {
    width: 200,
    height: 200,
    top: '8%',
    right: -70,
    backgroundColor: theme.colors.healingGreen,
  },
  ambientTwo: {
    width: 150,
    height: 150,
    bottom: '32%',
    left: -55,
    backgroundColor: theme.colors.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 130,
  },
  header: {
    marginBottom: 26,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOrb: {
    position: 'absolute',
    top: -34,
    right: -34,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroCopy: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 18,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  moodPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: '#FFFFFF',
  },
  trackMeta: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 14,
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
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOffset: {
    marginLeft: 2,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(45,90,76,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(45,90,76,0.16)',
    alignItems: 'center',
  },
  tipText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 18,
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
