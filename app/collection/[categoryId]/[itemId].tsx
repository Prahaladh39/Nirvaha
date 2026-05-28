import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Dimensions, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from 'lucide-react-native';
import { theme } from '../../../constants/theme';
import { collectionCategories, collectionItems } from '../../../constants/collectionData';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AudioPlayer() {
  const insets = useSafeAreaInsets();
  const { categoryId, itemId } = useLocalSearchParams<{ categoryId: string, itemId: string }>();
  const category = collectionCategories.find(c => c.id === categoryId);
  const items = collectionItems[categoryId as string] || [];
  const itemIndex = items.findIndex(i => i.id === itemId);
  const item = items[itemIndex];

  const player = useAudioPlayer(item?.audioFile ?? null, { updateInterval: 200 });
  const status = useAudioPlayerStatus(player);
  
  const videoPlayer = useVideoPlayer(item?.videoFile ?? null, vp => {
    vp.loop = true;
    vp.muted = true;
    vp.play();
  });

  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const pulseValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  // Parse duration string "MM:SS" to seconds
  const parseDuration = (dur: string) => {
    if (!dur) return 0;
    const parts = dur.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0]; // just seconds if no colon
  };

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "doNotMix",
      allowsRecording: false,
      shouldPlayInBackground: true,
    }).catch(err => console.warn("Audio mode error", err));

    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    rotateValue.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    player.play();

    // Auto-loop if duration <= 1 minute
    if (item && parseDuration(item.duration) <= 60) {
      player.loop = true;
    }

    return () => {
      // expo-audio player might be released already
      try {
        player.pause();
      } catch (e) {
        // Ignore if already released
      }
    };
  }, [item]); // Re-run if item changes (for next/prev)

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
      if (item.videoFile) videoPlayer.pause();
    } else {
      if (status.didJustFinish) {
        player.seekTo(0).catch(() => undefined);
      }
      player.play();
      if (item.videoFile) videoPlayer.play();
    }
  };

  const handleNext = () => {
    if (itemIndex < items.length - 1) {
      const nextItem = items[itemIndex + 1];
      router.replace(`/collection/${categoryId}/${nextItem.id}`);
    } else {
      const firstItem = items[0];
      router.replace(`/collection/${categoryId}/${firstItem.id}`);
    }
  };

  const handlePrevious = () => {
    if (itemIndex > 0) {
      const prevItem = items[itemIndex - 1];
      router.replace(`/collection/${categoryId}/${prevItem.id}`);
    } else {
      const lastItem = items[items.length - 1];
      router.replace(`/collection/${categoryId}/${lastItem.id}`);
    }
  };

  const handleSeek = (event: GestureResponderEvent) => {
    if (status.duration > 0 && progressBarWidth > 0) {
      const touchX = event.nativeEvent.locationX;
      const seekRatio = Math.max(0, Math.min(touchX / progressBarWidth, 1));
      const seekTime = seekRatio * status.duration;
      player.seekTo(seekTime).catch(() => undefined);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    opacity: interpolate(pulseValue.value, [1, 1.1], [0.3, 0.15], Extrapolate.CLAMP),
  }));

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  if (!item || !category) return null;

  const progress = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {item.videoFile ? (
        <View style={StyleSheet.absoluteFill}>
          <VideoView 
            player={videoPlayer} 
            style={StyleSheet.absoluteFill} 
            nativeControls={false}
            contentFit="cover"
          />
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        </View>
      ) : (
        <LinearGradient colors={category.colors} style={StyleSheet.absoluteFill} />
      )}
      
      {/* Background Decor */}
      {!item.videoFile && <View style={styles.ambientGlow} />}
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace(`/collection/${categoryId}`);
            }
          }} 
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerCategory}>{category.title}</Text>
          <Text style={styles.headerItem} numberOfLines={1}>{item.title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.playerContent}>
        {/* Visualizer Area */}
        {!item.videoFile && (
          <View style={styles.visualizerContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <Animated.View style={[styles.pulseCircle, pulseStyle, { width: 340, height: 340, borderRadius: 170, top: '50%', left: '50%', marginTop: -170, marginLeft: -170 }]} />
          
          <View style={styles.discContainer}>
            <Animated.View style={[styles.disc, discStyle]}>
              <LinearGradient 
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} 
                style={styles.discGradient} 
              />
              <View style={styles.discInner}>
                <Text style={styles.discEmoji}>{item.icon}</Text>
              </View>
            </Animated.View>
          </View>
          </View>
        )}

        {/* Info Area */}
        <View style={styles.infoArea}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.trackSubtitle}>{item.moodTag} • {category.title}</Text>
        </View>

        {/* Progress Area */}
        <View style={styles.progressArea}>
          <Pressable 
            style={styles.progressBarContainer}
            onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
            onPress={handleSeek}
          >
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </Pressable>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>{formatTime(status.currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
          </View>
        </View>

        {/* Controls Area */}
        <View style={styles.controlsArea}>
          <Pressable 
            style={styles.secondaryBtn}
            onPress={() => {
              player.loop = !player.loop;
            }}
          >
            <Repeat size={20} color={player.loop ? theme.colors.gold : "rgba(255,255,255,0.5)"} />
          </Pressable>
          
          <Pressable style={styles.skipBtn} onPress={handlePrevious}>
            <SkipBack size={28} color="#FFFFFF" fill="#FFFFFF" />
          </Pressable>
          
          <Pressable style={styles.playPauseBtn} onPress={handlePlayPause}>
            {status.playing ? (
              <Pause size={32} color="#000000" fill="#000000" />
            ) : (
              <Play size={32} color="#000000" fill="#000000" style={{ marginLeft: 6 }} />
            )}
          </Pressable>
          
          <Pressable style={styles.skipBtn} onPress={handleNext}>
            <SkipForward size={28} color="#FFFFFF" fill="#FFFFFF" />
          </Pressable>
          
          <Pressable style={styles.secondaryBtn}>
            <Volume2 size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  ambientGlow: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerCategory: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerItem: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 2,
    maxWidth: width * 0.6,
  },
  headerSpacer: {
    width: 44,
  },
  playerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  visualizerContainer: {
    width: width,
    height: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    top: '50%',
    left: '50%',
    marginTop: -140,
    marginLeft: -140,
  },
  discContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  disc: {
    flex: 1,
    borderRadius: 110,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  discGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  discInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  discEmoji: {
    fontSize: 90,
  },
  infoArea: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  trackTitle: {
    fontFamily: theme.typography.display,
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  progressArea: {
    width: width - 80,
    marginBottom: 40,
  },
  progressBarContainer: {
    height: 20,
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  timeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  controlsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 80,
  },
  playPauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  skipBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
