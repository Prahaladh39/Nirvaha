import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Audio } from 'expo-av';
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
  const { categoryId, itemId } = useLocalSearchParams<{ categoryId: string, itemId: string }>();
  const category = collectionCategories.find(c => c.id === categoryId);
  const item = collectionItems[categoryId as string]?.find(i => i.id === itemId);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const pulseValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  useEffect(() => {
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

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function loadAudio() {
    try {
      if (!item) return;
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        item.audioFile,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    opacity: interpolate(pulseValue.value, [1, 1.1], [0.3, 0.15], Extrapolate.CLAMP),
  }));

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  if (!item || !category) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={category.colors} style={StyleSheet.absoluteFill} />
      
      {/* Background Decor */}
      <View style={styles.ambientGlow} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
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
        <View style={styles.visualizerContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <Animated.View style={[styles.pulseCircle, pulseStyle, { width: 340, height: 340 }]} />
          
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

        {/* Info Area */}
        <View style={styles.infoArea}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.trackSubtitle}>{item.moodTag} • {category.title}</Text>
        </View>

        {/* Progress Area */}
        <View style={styles.progressArea}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls Area */}
        <View style={styles.controlsArea}>
          <Pressable style={styles.secondaryBtn}>
            <Repeat size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
          
          <Pressable style={styles.skipBtn}>
            <SkipBack size={28} color="#FFFFFF" fill="#FFFFFF" />
          </Pressable>
          
          <Pressable style={styles.playPauseBtn} onPress={handlePlayPause}>
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : isPlaying ? (
              <Pause size={32} color="#000000" fill="#000000" />
            ) : (
              <Play size={32} color="#000000" fill="#000000" style={{ marginLeft: 4 }} />
            )}
          </Pressable>
          
          <Pressable style={styles.skipBtn}>
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
    top: '20%',
    left: '10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
    filter: 'blur(80px)',
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
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    borderRadius: 180,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    fontSize: 80,
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
