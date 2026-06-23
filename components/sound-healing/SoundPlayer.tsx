import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  SlideInDown,
  SlideOutDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { SoundTrack } from "../../constants/soundHealingData";
import { theme } from "../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ARTWORK_SIZE = SCREEN_WIDTH * 0.82

interface SoundPlayerProps {
  track: SoundTrack | null;
  onClose: () => void;
  playlist?: SoundTrack[];
  onTrackChange?: (track: SoundTrack) => void;
}

interface VisualTheme {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  bgColors: string[];
  tagBg: string;
  tagText: string;
  insightBg: string;
  quote: string;
  intention: string;
  frequency: string;
  tags: string[];
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Returns a premium visual theme mapped to each specific track type
function getTrackTheme(track: SoundTrack | null): VisualTheme {
  const defaultTheme: VisualTheme = {
    primary: "#E6F4FE",
    secondary: "rgba(255, 255, 255, 0.6)",
    glow: "rgba(45, 90, 76, 0.35)",
    accent: "#D4AF37", // Gold
    bgColors: ["#0E2A1C", "#071710"], // Deep healing green base
    tagBg: "rgba(212, 175, 55, 0.12)",
    tagText: "#D4AF37",
    insightBg: "rgba(255, 255, 255, 0.03)",
    quote: "Let the sound guide you back to balance.",
    intention: "Inner Harmony",
    frequency: "432 Hz",
    tags: ["Healing", "Stillness", "Calm"],
  };

  if (!track) return defaultTheme;

  const id = track.id.toLowerCase();
  const title = track.title.toLowerCase();
  const category = (track.category || "").toLowerCase();

  // Desert / Amber / Gold tones
  if (id.includes("desert") || title.includes("desert") || category === "frequency") {
    return {
      primary: "#FFE4B5",
      secondary: "rgba(255, 222, 173, 0.7)",
      glow: "rgba(229, 169, 60, 0.4)",
      accent: "#E5A93C",
      bgColors: ["#2B1B0D", "#1A1008"],
      tagBg: "rgba(229, 169, 60, 0.12)",
      tagText: "#E5A93C",
      insightBg: "rgba(229, 169, 60, 0.05)",
      quote: "In the depth of stillness, we find our truest reflection.",
      intention: "Deep Stillness",
      frequency: "528 Hz",
      tags: ["Stillness", "Warmth", "Grounding"],
    };
  }

  // Ocean / Water / Coastal tones (Teal/Blue)
  if (id.includes("tides") || title.includes("tides") || title.includes("ocean") || id.includes("conch") || category === "breath") {
    return {
      primary: "#E0F7FA",
      secondary: "rgba(178, 235, 242, 0.7)",
      glow: "rgba(77, 208, 225, 0.35)",
      accent: "#4DD0E1",
      bgColors: ["#0A252D", "#041114"],
      tagBg: "rgba(77, 208, 225, 0.12)",
      tagText: "#4DD0E1",
      insightBg: "rgba(77, 208, 225, 0.05)",
      quote: "Listen to the tide within you, rising and falling in perfect peace.",
      intention: "Conscious Breath",
      frequency: "741 Hz",
      tags: ["Breath", "Ocean", "Flow"],
    };
  }

  // Forest / Pines / Grounding tones (Deep Green/Earth)
  if (id.includes("pine") || title.includes("pine") || id.includes("forest") || title.includes("forest") || category === "nature" || category === "grounding") {
    return {
      primary: "#E8F5E9",
      secondary: "rgba(200, 230, 201, 0.7)",
      glow: "rgba(129, 199, 132, 0.35)",
      accent: "#81C784",
      bgColors: ["#092418", "#04100A"],
      tagBg: "rgba(129, 199, 132, 0.12)",
      tagText: "#81C784",
      insightBg: "rgba(129, 199, 132, 0.05)",
      quote: "Stand tall like the pines, rooted deep in the present moment.",
      intention: "Earth Grounding",
      frequency: "528 Hz",
      tags: ["Grounding", "Restoration", "Nature"],
    };
  }

  // Sunrise / Dawn tones (Warm Peach/Coral)
  if (id.includes("dawn") || title.includes("dawn") || id.includes("morning") || title.includes("morning")) {
    return {
      primary: "#FFECE6",
      secondary: "rgba(255, 218, 204, 0.7)",
      glow: "rgba(255, 138, 101, 0.35)",
      accent: "#FF8A65",
      bgColors: ["#2B1511", "#140907"],
      tagBg: "rgba(255, 138, 101, 0.12)",
      tagText: "#FF8A65",
      insightBg: "rgba(255, 138, 101, 0.05)",
      quote: "Each morning is a new beginning, a quiet space to reset.",
      intention: "Morning Clarity",
      frequency: "528 Hz",
      tags: ["Dawn", "Renewal", "Calm"],
    };
  }

  // Sleep / Midnight / Night (Midnight Indigo)
  if (category === "sleep" || id.includes("sleep") || title.includes("sleep") || id.includes("night") || title.includes("night")) {
    return {
      primary: "#E8EAF6",
      secondary: "rgba(197, 202, 233, 0.7)",
      glow: "rgba(121, 134, 203, 0.3)",
      accent: "#7986CB",
      bgColors: ["#0C0E24", "#050611"],
      tagBg: "rgba(121, 134, 203, 0.12)",
      tagText: "#7986CB",
      insightBg: "rgba(121, 134, 203, 0.05)",
      quote: "Release the day, let the quiet night cradle your thoughts.",
      intention: "Deep Rest",
      frequency: "432 Hz",
      tags: ["Rest", "Sleep", "Silence"],
    };
  }

  // Mantras / Spiritual (Deep Purple/Violet)
  if (category === "mantras" || id.includes("mantra") || title.includes("mantra")) {
    return {
      primary: "#F3E5F5",
      secondary: "rgba(225, 190, 231, 0.7)",
      glow: "rgba(186, 104, 200, 0.3)",
      accent: "#BA68C8",
      bgColors: ["#1C0B29", "#0B0410"],
      tagBg: "rgba(186, 104, 200, 0.12)",
      tagText: "#BA68C8",
      insightBg: "rgba(186, 104, 200, 0.05)",
      quote: "Let the repetition of sacred sound quiet the busy mind.",
      intention: "Spiritual Calm",
      frequency: "528 Hz",
      tags: ["Spiritual", "Mantra", "Peace"],
    };
  }

  return defaultTheme;
}

// Slowly drifting, organic background circles
function DriftingOrbs({ colors }: { colors: string[] }) {
  const orb1X = useSharedValue(0);
  const orb1Y = useSharedValue(0);
  const orb1Scale = useSharedValue(1);

  const orb2X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2Scale = useSharedValue(1);

  useEffect(() => {
    orb1X.value = withRepeat(
      withSequence(
        withTiming(45, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-35, { duration: 13000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-55, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(45, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb1Scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-55, { duration: 13000, easing: Easing.inOut(Easing.ease) }),
        withTiming(35, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 12000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb2Y.value = withRepeat(
      withSequence(
        withTiming(45, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-35, { duration: 13000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    orb2Scale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 9500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.25, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const style1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1X.value },
      { translateY: orb1Y.value },
      { scale: orb1Scale.value }
    ],
  }));

  const style2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2X.value },
      { translateY: orb2Y.value },
      { scale: orb2Scale.value }
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.ambientOrb, styles.orb1, style1, { backgroundColor: colors[0] }]} />
      <Animated.View style={[styles.ambientOrb, styles.orb2, style2, { backgroundColor: colors[1] || colors[0] }]} />
    </View>
  );
}

// Sparse, elegant upward drifting golden particles
function GoldenParticle({ delay, startX, accentColor }: { delay: number; startX: number; accentColor: string }) {
  const y = useSharedValue(SCREEN_HEIGHT);
  const x = useSharedValue(startX);
  const opacity = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(SCREEN_HEIGHT, { duration: 0 }),
        withDelay(
          delay,
          withTiming(-40, {
            duration: 11000 + Math.random() * 4000,
            easing: Easing.linear,
          })
        )
      ),
      -1,
      false
    );

    x.value = withRepeat(
      withSequence(
        withTiming(startX + 20, { duration: 3000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(startX - 20, { duration: 3000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(0.45, { duration: 1800 })),
        withTiming(0.45, { duration: 5500 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );
  }, [delay, startX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        { backgroundColor: accentColor }
      ]}
    />
  );
}

function FloatingParticles({ accentColor }: { accentColor: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      delay: i * 700,
      startX: Math.random() * SCREEN_WIDTH,
    }));
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <GoldenParticle key={p.id} delay={p.delay} startX={p.startX} accentColor={accentColor} />
      ))}
    </View>
  );
}

// Meditative wave representing a deep, conscious breathing pattern
function BreathingWaveform({ playing, accentColor }: { playing: boolean; accentColor: string }) {
  const time = useSharedValue(0);
  const breathePhase = useSharedValue(0.5);

  useEffect(() => {
    if (playing) {
      time.value = withRepeat(
        withTiming(100, { duration: 13000, easing: Easing.linear }),
        -1,
        false
      );
      breathePhase.value = withRepeat(
        withSequence(
          withTiming(1.0, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 3800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      time.value = withTiming(time.value, { duration: 400 });
      breathePhase.value = withTiming(0.35, { duration: 600 });
    }
  }, [playing]);

  const animatedProps1 = useAnimatedProps(() => {
    const width = 300;
    const height = 60;
    const steps = 30;
    const currentBreathe = breathePhase.value;
    const t = time.value;
    const points = [];

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      // Deep wave representing inhale/exhale cycles
      const wave1 = Math.sin((i / steps) * Math.PI * 2 + t * 0.45) * 16 * currentBreathe;
      const wave2 = Math.cos((i / steps) * Math.PI * 4.5 - t * 0.6) * 5 * currentBreathe;
      const y = height / 2 + wave1 + wave2;
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return {
      d: points.join(" "),
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const width = 300;
    const height = 60;
    const steps = 30;
    const currentBreathe = breathePhase.value;
    const t = time.value;
    const points = [];

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const wave1 = Math.sin((i / steps) * Math.PI * 2.2 - t * 0.35) * 12 * currentBreathe;
      const wave2 = Math.cos((i / steps) * Math.PI * 5 + t * 0.5) * 4 * currentBreathe;
      const y = height / 2 + wave1 + wave2;
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return {
      d: points.join(" "),
    };
  });

  return (
    <View style={styles.waveformContainer}>
      <Svg width={300} height={60} viewBox="0 0 300 60">
        <Defs>
          <SvgLinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <Stop offset="25%" stopColor={accentColor} stopOpacity="0.4" />
            <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="75%" stopColor={accentColor} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </SvgLinearGradient>
        </Defs>
        {/* Layered secondary ambient wave */}
        <AnimatedPath
          animatedProps={animatedProps2}
          stroke="url(#waveGrad)"
          strokeWidth={1.5}
          fill="none"
          opacity={0.4}
        />
        {/* Main glowing white-gold wave */}
        <AnimatedPath
          animatedProps={animatedProps1}
          stroke="url(#waveGrad)"
          strokeWidth={2.5}
          fill="none"
          opacity={0.8}
        />
      </Svg>
    </View>
  );
}

// Custom botanical illustration for Reflection Card
const LeafIllustration = ({ color }: { color: string }) => (
  <Svg width={32} height={32} viewBox="0 0 32 32" style={styles.leafIcon}>
    <Path
      d="M16 26C16 26 16 19 16 12C16 12 12 15 10 12C8.5 9.5 10.5 7 13 8C15.5 9 16 12 16 12C16 12 16.5 9 19 8C21.5 7 23.5 9.5 22 12C20 15 16 12 16 12C16 12 16 5 16 5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
      opacity={0.7}
    />
  </Svg>
);

export default function SoundPlayer({
  track,
  onClose,
  playlist = [],
  onTrackChange,
}: SoundPlayerProps) {
  const player = useAudioPlayer(track?.source ?? require("../../assets/audio/desert-glass-loop.mp3"), { updateInterval: 200 });
  const status = useAudioPlayerStatus(player);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isPlayState, setIsPlayState] = useState(false);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: "doNotMix",
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    }).catch((error) => {
      console.warn("Unable to configure audio mode", error);
    });
  }, []);

  useEffect(() => {
    if (track) {
      const source = track.source || require("../../assets/audio/desert-glass-loop.mp3");
      try {
        player.replace(source);
      } catch (error) {
        console.warn("Unable to replace audio source", error);
      }
      setLoopEnabled(true);
      player.loop = false; // Disable native loop so didJustFinish will fire
      player.pause();
      player.seekTo(0).catch(() => undefined);
      setIsPlayState(false);
    } else {
      player.pause();
      setIsPlayState(false);
    }
  }, [player, track]);

  useEffect(() => {
    player.loop = false; // Disable native loop
  }, [player]);

  useEffect(() => {
    if (status.playing) {
      setIsPlayState(true);
    } else if (!status.playing && !status.didJustFinish) {
      setIsPlayState(false);
    }
  }, [status.playing, status.didJustFinish]);

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0)
        .then(() => {
          player.play();
        })
        .catch((err) => console.warn("Loop seek error", err));
    }
  }, [status.didJustFinish, player]);

  const isPlaying = isPlayState;
  const duration = status.duration || 0;
  const currentTime = status.currentTime || 0;
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const activeIndex = track
    ? playlist.findIndex((item) => item.id === track.id)
    : -1;
  const canSkip = playlist.length > 1 && activeIndex >= 0;

  // Slowly pulsing breathing effect for artwork
  const pulseValue = useSharedValue(1);
  const energyRingScale = useSharedValue(1);
  const energyRingOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (isPlaying) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.97, { duration: 3800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      energyRingScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.96, { duration: 3800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      energyRingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.35, { duration: 3800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(1, { duration: 600 });
      energyRingScale.value = withTiming(1, { duration: 600 });
      energyRingOpacity.value = withTiming(0.4, { duration: 600 });
    }
  }, [isPlaying]);

  const pulsingArtworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const breathingRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: energyRingScale.value }],
    opacity: energyRingOpacity.value,
  }));

  const elapsed = useMemo(() => {
    const seconds = Math.floor(currentTime);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }, [currentTime]);

  const handlePlayPause = () => {
    if (!track) return;
    if (isPlaying) {
      player.pause();
      setIsPlayState(false);
    } else {
      if (status.didJustFinish) {
        player.seekTo(0).catch(() => undefined);
      }
      player.play();
      setIsPlayState(true);
    }
  };

  const handleClose = () => {
    player.pause();
    player.seekTo(0).catch(() => undefined);
    onClose();
  };

  const handleSkip = (direction: 1 | -1) => {
    if (!canSkip) return;
    const nextIndex = (activeIndex + direction + playlist.length) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      player.pause();
      onTrackChange?.(nextTrack);
    }
  };

  const handleSeek = (event: GestureResponderEvent) => {
    if (!duration || progressWidth <= 0) return;
    const tapX = Math.max(0, Math.min(event.nativeEvent.locationX, progressWidth));
    const nextTime = (tapX / progressWidth) * duration;
    player.seekTo(nextTime).catch(() => undefined);
  };

  const themeColors = useMemo(() => getTrackTheme(track), [track]);

  const coverImageUri = useMemo(() => {
    return (
      track?.coverImage ||
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop"
    );
  }, [track]);

  return (
    <Modal
      visible={!!track}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {track && (
        <Animated.View
          entering={SlideInDown.springify().damping(28).stiffness(260)}
          exiting={SlideOutDown}
          style={styles.modal}
        >
          {/* Layered Dynamic Background System */}
          <View style={StyleSheet.absoluteFill}>
            <DriftingOrbs colors={themeColors.bgColors} />
            <FloatingParticles accentColor={themeColors.accent} />
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
          </View>

          <View style={styles.modalContent}>
            {/* Floating Close Button in absolute header */}
            <View
              style={[
                styles.header,
                {
                  position: "absolute",
                  top: 10,
                  left: 0,
                  right: 0,
                  zIndex: 100,
                }
              ]}
            >
              <Pressable style={styles.floatingCloseButton} onPress={handleClose}>
                <X size={18} color="rgba(255,255,255,0.7)" />
              </Pressable>
            </View>

            {/* Scrollable contents to support smaller mobile displays */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Artwork Hero Section */}
              <View style={styles.artworkWrapper}>
                {/* Breathing Energy Ring */}
                <Animated.View
                  style={[
                    styles.energyRing,
                    breathingRingStyle,
                    { borderColor: themeColors.accent, shadowColor: themeColors.accent }
                  ]}
                />
                {/* Soft Radial Glow behind artwork */}
                <View
                  style={[
                    styles.artworkRadialGlow,
                    { backgroundColor: themeColors.accent + "20" }
                  ]}
                />
                {/* Main Circular Artwork Container */}
                <Animated.View
                  style={[
                    styles.artworkContainer,
                    pulsingArtworkStyle,
                    { shadowColor: themeColors.accent }
                  ]}
                >
                  <Image
                    source={{ uri: coverImageUri }}
                    style={styles.artworkImage}
                    resizeMode="cover"
                  />
                  {/* Subtle glass reflection overlay */}
                  <View style={styles.glassReflection} />
                </Animated.View>
              </View>

              {/* Editorial Typography */}
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackSubtitle} numberOfLines={2}>
                {track.description}
              </Text>

              {/* Translucent Wellness tags */}
              <View style={styles.tagsContainer}>
                {themeColors.tags.map((tag, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.tagPill,
                      {
                        backgroundColor: themeColors.tagBg,
                        borderColor: themeColors.accent + "25"
                      }
                    ]}
                  >
                    <Text style={[styles.tagText, { color: themeColors.accent }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Session Insights Card */}
              <View
                style={[
                  styles.insightCard,
                  {
                    backgroundColor: themeColors.insightBg,
                    borderColor: "rgba(255, 255, 255, 0.08)"
                  }
                ]}
              >
                <View style={styles.insightCol}>
                  <Text style={styles.insightLabel}>DURATION</Text>
                  <Text style={[styles.insightValue, { color: themeColors.primary }]}>
                    {track.duration}
                  </Text>
                </View>
                <View style={styles.insightDivider} />
                <View style={styles.insightCol}>
                  <Text style={styles.insightLabel}>INTENTION</Text>
                  <Text style={[styles.insightValue, { color: themeColors.primary }]}>
                    {themeColors.intention}
                  </Text>
                </View>
                <View style={styles.insightDivider} />
                <View style={styles.insightCol}>
                  <Text style={styles.insightLabel}>FREQUENCY</Text>
                  <Text style={[styles.insightValue, { color: themeColors.primary }]}>
                    {themeColors.frequency}
                  </Text>
                </View>
              </View>

              {/* Breathing Waveform visualizer */}
              <BreathingWaveform playing={isPlaying} accentColor={themeColors.accent} />

              {/* Progress Bar Section */}
              <View style={styles.progressBlock}>
                <Pressable
                  style={styles.progressContainer}
                  onLayout={(event) => setProgressWidth(event.nativeEvent.layout.width)}
                  onPress={handleSeek}
                >
                  <View style={styles.progressTrack}>
                    <LinearGradient
                      colors={[themeColors.accent, "#FFFFFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                    {progress > 0 && (
                      <View
                        style={[
                          styles.progressThumb,
                          {
                            left: `${progress}%`,
                            backgroundColor: themeColors.accent,
                            shadowColor: themeColors.accent
                          }
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{elapsed}</Text>
                  <Text style={styles.timeText}>{track.duration}</Text>
                </View>
              </View>

              {/* Playback Controls Row */}
              <View style={styles.controlsRow}>
                <Pressable
                  style={[
                    styles.controlButtonSecondary,
                    styles.controlButtonActive,
                  ]}
                  onPress={() => undefined}
                >
                  <Repeat
                    size={20}
                    color={themeColors.accent}
                  />
                </Pressable>

                <Pressable
                  style={[styles.controlButtonSecondary, !canSkip && { opacity: 0.3 }]}
                  onPress={() => handleSkip(-1)}
                  disabled={!canSkip}
                >
                  <SkipBack size={24} color="#FFFFFF" />
                </Pressable>

                {/* Ceremonial Play Button Control */}
                <Pressable
                  style={[
                    styles.playButtonWrapper,
                    {
                      shadowColor: themeColors.accent,
                    }
                  ]}
                  onPress={handlePlayPause}
                >
                  <View style={styles.playButtonOuterRing}>
                    <LinearGradient
                      colors={[themeColors.accent, "#FFFFFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.playButtonGradient}
                    >
                      {isPlaying ? (
                        <Pause size={24} color="#0A0B0D" fill="#0A0B0D" />
                      ) : (
                        <Play
                          size={24}
                          color="#0A0B0D"
                          fill="#0A0B0D"
                          style={styles.playIconOffset}
                        />
                      )}
                    </LinearGradient>
                  </View>
                </Pressable>

                <Pressable
                  style={[styles.controlButtonSecondary, !canSkip && { opacity: 0.3 }]}
                  onPress={() => handleSkip(1)}
                  disabled={!canSkip}
                >
                  <SkipForward size={24} color="#FFFFFF" />
                </Pressable>

                <View style={styles.controlButtonSecondary} />
              </View>

              {/* Translucent Glass Quote Card */}
              <View
                style={[
                  styles.reflectionCard,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderColor: "rgba(255, 255, 255, 0.05)"
                  }
                ]}
              >
                {/* Top golden highlight bar */}
                <View style={[styles.goldHighlightBar, { backgroundColor: themeColors.accent + "50" }]} />

                <LeafIllustration color={themeColors.accent} />
                <Text style={[styles.reflectionQuote, { color: themeColors.secondary }]}>
                  "{themeColors.quote}"
                </Text>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "#0A0B0D", // Deep charcoal black base (Layer 1)
  },
  modalContent: {
    flex: 1,
  },
  ambientOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.18,
  },
  orb1: {
    width: 320,
    height: 320,
    top: "8%",
    left: "-15%",
  },
  orb2: {
    width: 270,
    height: 270,
    bottom: "18%",
    right: "-12%",
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
  },
  floatingCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
  },
  artworkWrapper: {
    width: ARTWORK_SIZE + 40,
    height: ARTWORK_SIZE + 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: -20,
    marginBottom: 10,
  },
  energyRing: {
    position: "absolute",
    width: ARTWORK_SIZE + 32,
    height: ARTWORK_SIZE + 32,
    borderRadius: (ARTWORK_SIZE + 32) / 2,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  artworkRadialGlow: {
    position: "absolute",
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: ARTWORK_SIZE / 2,
    opacity: 0.15,
  },
  artworkContainer: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: ARTWORK_SIZE / 2,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
  },
  glassReflection: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
    // Simulated diagonal glass reflection
    transform: [{ rotate: "45deg" }, { scaleX: 0.2 }, { translateY: -100 }],
  },
  trackTitle: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: "400",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  trackSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 28,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  insightCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  insightCol: {
    flex: 1,
    alignItems: "center",
  },
  insightLabel: {
    fontFamily: theme.typography.body,
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  insightValue: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    fontWeight: "600",
  },
  insightDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  waveformContainer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  progressBlock: {
    width: "100%",
    marginBottom: 24,
  },
  progressContainer: {
    width: "100%",
    paddingVertical: 12,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    top: -3,
    marginLeft: -5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  timeText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: 36,
  },
  controlButtonSecondary: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  controlButtonActive: {
    opacity: 1,
  },
  playButtonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  playButtonOuterRing: {
    flex: 1,
    width: "100%",
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    padding: 2,
  },
  playButtonGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconOffset: {
    marginLeft: 3,
  },
  reflectionCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  goldHighlightBar: {
    position: "absolute",
    top: 0,
    left: "25%",
    right: "25%",
    height: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  leafIcon: {
    marginBottom: 10,
  },
  reflectionQuote: {
    fontFamily: theme.typography.display,
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
});
