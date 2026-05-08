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
  GestureResponderEvent,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SoundTrack } from "../../constants/soundHealingData";
import { theme } from "../../constants/theme";

interface SoundPlayerProps {
  track: SoundTrack | null;
  onClose: () => void;
  playlist?: SoundTrack[];
  onTrackChange?: (track: SoundTrack) => void;
}

function WaveformBar({ index, playing }: { index: number; playing: boolean }) {
  const height = useSharedValue(8);

  useEffect(() => {
    if (playing) {
      const peak = 20 + Math.abs(Math.sin(index * 0.5)) * 46;
      const mid = 12 + Math.abs(Math.cos(index * 0.3)) * 34;
      height.value = withRepeat(
        withSequence(
          withTiming(peak, {
            duration: 520 + index * 8,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(mid, { duration: 460, easing: Easing.inOut(Easing.ease) }),
          withTiming(8, { duration: 420, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      height.value = withTiming(8, { duration: 300 });
    }
  }, [height, index, playing]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View style={[styles.waveBar, style]}>
      <LinearGradient
        colors={[theme.colors.healingGreen, theme.colors.gold]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

function WaveformVisual({ playing }: { playing: boolean }) {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: 32 }).map((_, index) => (
        <WaveformBar key={index} index={index} playing={playing} />
      ))}
    </View>
  );
}

export default function SoundPlayer({
  track,
  onClose,
  playlist = [],
  onTrackChange,
}: SoundPlayerProps) {
  const player = useAudioPlayer(track?.source ?? null, { updateInterval: 200 });
  const status = useAudioPlayerStatus(player);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

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
      const shouldLoop = !!track.loop;
      setLoopEnabled(shouldLoop);
      player.loop = shouldLoop;
      player.pause();
      player.seekTo(0).catch(() => undefined);
    } else {
      player.pause();
    }
  }, [player, track]);

  useEffect(() => {
    player.loop = loopEnabled;
  }, [loopEnabled, player]);

  const isPlaying = status.playing;
  const duration = status.duration || 0;
  const currentTime = status.currentTime || 0;
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const activeIndex = track
    ? playlist.findIndex((item) => item.id === track.id)
    : -1;
  const canSkip = playlist.length > 1 && activeIndex >= 0;
  
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotateValue.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotateValue.value = withTiming(rotateValue.value);
    }
  }, [isPlaying, rotateValue]);

  const discRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const elapsed = useMemo(() => {
    const seconds = Math.floor(currentTime);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }, [currentTime]);

  const handlePlayPause = () => {
    if (!track?.source) return;
    if (isPlaying) {
      player.pause();
    } else {
      if (status.didJustFinish) {
        player.seekTo(0).catch(() => undefined);
      }
      player.play();
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
          <View style={[styles.ambientOrb, styles.ambientOne]} />
          <View style={[styles.ambientOrb, styles.ambientTwo]} />

          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Pressable style={styles.iconButton} onPress={handleClose}>
                <X size={18} color="rgba(255,255,255,0.75)" />
              </Pressable>
              <Text style={styles.nowPlaying}>Now Playing</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
              <Animated.View
                entering={FadeIn.duration(350)}
                style={[styles.trackIcon, isPlaying && styles.trackIconActive, discRotation]}
              >
                <Text style={styles.trackEmoji}>{track.icon}</Text>
              </Animated.View>

              <Text style={styles.title}>{track.title}</Text>
              <Text style={styles.description}>{track.description}</Text>
              <View style={styles.moodPill}>
                <Text style={styles.moodText}>{track.moodTag}</Text>
              </View>

              <WaveformVisual playing={isPlaying} />

              <View style={styles.progressBlock}>
                <Pressable
                  style={styles.progressTrack}
                  onLayout={(event) => setProgressWidth(event.nativeEvent.layout.width)}
                  onPress={handleSeek}
                >
                  <LinearGradient
                    colors={[theme.colors.healingGreen, theme.colors.gold]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </Pressable>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{elapsed}</Text>
                  <Text style={styles.timeText}>{track.duration}</Text>
                </View>
              </View>

              <View style={styles.controls}>
                <Pressable
                  style={[
                    styles.controlButton,
                    loopEnabled && styles.controlButtonActive,
                  ]}
                  onPress={() => setLoopEnabled((value) => !value)}
                >
                  <Repeat
                    size={20}
                    color={
                      loopEnabled ? theme.colors.gold : "rgba(255,255,255,0.55)"
                    }
                  />
                </Pressable>
                <Pressable style={styles.controlButton} onPress={() => handleSkip(-1)}>
                  <SkipBack size={24} color="#FFFFFF" />
                </Pressable>
                <Pressable style={styles.playButton} onPress={handlePlayPause}>
                  <LinearGradient
                    colors={[
                      theme.colors.healingGreen,
                      theme.colors.healingGreenLight,
                    ]}
                    style={styles.playGradient}
                  >
                    {isPlaying ? (
                      <Pause
                        size={28}
                        color={theme.colors.primaryForeground}
                        fill={theme.colors.primaryForeground}
                      />
                    ) : (
                      <Play
                        size={28}
                        color={theme.colors.primaryForeground}
                        fill={theme.colors.primaryForeground}
                        style={styles.playIconOffset}
                      />
                    )}
                  </LinearGradient>
                </Pressable>
                <Pressable style={styles.controlButton} onPress={() => handleSkip(1)}>
                  <SkipForward size={24} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.intention}>
              "Let the sound guide you back to balance"
            </Text>
          </SafeAreaView>
        </Animated.View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
  },
  ambientOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.16,
  },
  ambientOne: {
    width: 288,
    height: 288,
    top: "18%",
    alignSelf: "center",
    backgroundColor: theme.colors.healingGreen,
  },
  ambientTwo: {
    width: 190,
    height: 190,
    bottom: "28%",
    right: "12%",
    backgroundColor: theme.colors.gold,
    opacity: 0.12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  nowPlaying: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  trackIcon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    backgroundColor: "rgba(45,90,76,0.16)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.14)",
  },
  trackIconActive: {
    shadowColor: theme.colors.healingGreen,
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 8,
  },
  trackEmoji: {
    fontSize: 48,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 25,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    maxWidth: 300,
  },
  moodPill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(45,90,76,0.14)",
  },
  moodText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: theme.colors.healingGreenLight,
  },
  waveform: {
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginVertical: 24,
  },
  waveBar: {
    width: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBlock: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 24,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  controlButton: {
    width: 30,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonActive: {
    opacity: 1,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: theme.colors.healingGreen,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  playGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playIconOffset: {
    marginLeft: 6,
  },
  intention: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontStyle: "italic",
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    paddingHorizontal: 32,
    paddingBottom: 34,
  },
});
