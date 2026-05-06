import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';

const PARTICLE_COUNT = 18;

// Replicate the random particle generation from ReactJS
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 4,
  isGold: i % 3 === 0,
}));

const Particle = ({ particle }: { particle: typeof particles[0] }) => {
  const progressY = useSharedValue(0);
  const progressX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Setup animations similar to Framer Motion keyframes
    // y: [0, -30 - Math.random() * 20, 0]
    progressY.value = withDelay(
      particle.delay * 1000,
      withRepeat(
        withSequence(
          withTiming(-30 - Math.random() * 20, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite
        false
      )
    );

    // x: [0, (p.id % 2 === 0 ? 12 : -12), 0]
    const xMovement = particle.id % 2 === 0 ? 12 : -12;
    progressX.value = withDelay(
      particle.delay * 1000,
      withRepeat(
        withSequence(
          withTiming(xMovement, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // opacity: [0, 0.7, 0]
    opacity.value = withDelay(
      particle.delay * 1000,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );

    // scale: [0.5, 1, 0.5]
    scale.value = withDelay(
      particle.delay * 1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: particle.duration * 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: progressY.value },
      { translateX: progressX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const backgroundColor = particle.isGold ? theme.colors.gold : theme.colors.healingGreenLight;
  const shadowColor = particle.isGold ? theme.colors.gold : theme.colors.healingGreenLight;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          left: `${particle.x}%` as any,
          top: `${particle.y}%` as any,
          backgroundColor,
          shadowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: particle.isGold ? 0.5 : 0.4,
          shadowRadius: particle.size * 3,
          elevation: particle.size, // For Android shadow
        },
        animatedStyle,
      ]}
    />
  );
};

export const ParticleOverlay = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} particle={p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
