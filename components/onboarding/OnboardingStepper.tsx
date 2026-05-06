import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingStepper({ currentStep, totalSteps }: OnboardingStepperProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i <= currentStep;
        return <StepIndicator key={i} isActive={isCompleted} />;
      })}
    </View>
  );
}

function StepIndicator({ isActive }: { isActive: boolean }) {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as `${number}%`,
    opacity: progress.value === 1 ? 1 : 0.7,
  }));

  return (
    <View style={styles.stepContainer}>
      <Animated.View style={[styles.stepFill, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 320,
    marginBottom: 32,
    alignSelf: 'center',
  },
  stepContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  stepFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: theme.colors.gold,
  },
});
