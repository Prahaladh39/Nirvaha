import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing,
  FadeIn,
  FadeOut,
  LinearGradient as ReanimatedLinearGradient
} from 'react-native-reanimated';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASE_DURATION = 4; // seconds
const TOTAL_SECONDS = 120; // 2 minutes

const phaseConfig: Record<Phase, { label: string; next: Phase }> = {
  inhale: { label: "Breathe in", next: "hold1" },
  hold1: { label: "Hold", next: "exhale" },
  exhale: { label: "Breathe out", next: "hold2" },
  hold2: { label: "Hold", next: "inhale" },
};

export default function BreatheScreen() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phaseTime, setPhaseTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.1 >= TOTAL_SECONDS) {
          setIsPlaying(false);
          return TOTAL_SECONDS;
        }
        return e + 0.1;
      });
      setPhaseTime((t) => {
        const next = t + 0.1;
        if (next >= PHASE_DURATION) {
          setPhase((p) => phaseConfig[p].next);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    // Circle scales: inhale grows (1.4), exhale shrinks (1.0), holds stay
    // We adjust based on user's logic targetScale (1, 0.55, 1, 0.55)
    let target = 1;
    if (phase === "inhale" || phase === "hold1") target = 1.4;
    else target = 1.0;

    scale.value = withTiming(target, { 
      duration: PHASE_DURATION * 1000, 
      easing: Easing.inOut(Easing.ease) 
    });
  }, [phase]);

  const reset = () => {
    setElapsed(0);
    setPhaseTime(0);
    setPhase("inhale");
    setIsPlaying(true);
    scale.value = 1;
  };

  const remaining = Math.max(0, Math.ceil(TOTAL_SECONDS - elapsed));
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isComplete = elapsed >= TOTAL_SECONDS;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Decor */}
      <View style={[styles.ambientOrb, styles.orbOne]} />
      <View style={[styles.ambientOrb, styles.orbTwo]} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerSubtitle}>Box breathing · 2 min</Text>
        <Pressable onPress={reset} style={styles.headerButton}>
          <RotateCcw size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.visualizerArea}>
          {/* Outer ring */}
          <Animated.View 
            style={[
              styles.outerRing, 
              animatedCircleStyle,
              { opacity: isPlaying ? 0.3 : 0.1 }
            ]} 
          />
          
          {/* Soft halo (using view with shadow/blur) */}
          <Animated.View style={[styles.halo, animatedCircleStyle]}>
             <LinearGradient
                colors={['rgba(50, 140, 140, 0.4)', 'rgba(50, 140, 140, 0)']}
                style={StyleSheet.absoluteFill}
              />
          </Animated.View>

          {/* Core circle */}
          <Animated.View style={[styles.coreCircle, animatedCircleStyle]}>
            <LinearGradient
              colors={['#328C8C', '#1A3D3D']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.phaseInfo}>
              <Animated.Text 
                key={phase}
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(400)}
                style={styles.phaseLabel}
              >
                {phaseConfig[phase].label}
              </Animated.Text>
              <Text style={styles.phaseTimer}>
                {Math.max(1, Math.ceil(PHASE_DURATION - phaseTime))}s
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Total Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{mm}:{ss}</Text>
          <Text style={styles.timerHint}>
            {isComplete ? "Beautiful. You're here." : "Follow the circle"}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsArea}>
          {!isComplete ? (
            <Pressable 
              style={styles.mainActionBtn}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" />}
              <Text style={styles.actionBtnText}>{isPlaying ? "Pause" : "Resume"}</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={styles.mainActionBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.actionBtnText}>Return home</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: `${(elapsed / TOTAL_SECONDS) * 100}%` }
            ]} 
          />
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
  ambientOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  orbOne: {
    width: 320,
    height: 320,
    top: '-8%',
    right: '-12%',
    backgroundColor: '#328C8C',
  },
  orbTwo: {
    width: 260,
    height: 260,
    bottom: '-10%',
    left: '-10%',
    backgroundColor: '#1A3D3D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizerArea: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: '#A0D6D6',
  },
  halo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
  },
  coreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 214, 214, 0.3)',
    shadowColor: '#328C8C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 10,
  },
  phaseInfo: {
    alignItems: 'center',
  },
  phaseLabel: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  phaseTimer: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  timerContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  timerText: {
    fontFamily: theme.typography.display,
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  timerHint: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  controlsArea: {
    marginTop: 40,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  actionBtnText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  progressBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#328C8C',
    borderRadius: 2,
  },
});
