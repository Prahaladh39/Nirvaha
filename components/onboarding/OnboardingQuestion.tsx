import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import type { OnboardingOption } from '../../constants/onboardingData';

interface Props {
  question: string;
  subtitle?: string;
  options: OnboardingOption[];
  onSelect: (index: number) => void;
}

export default function OnboardingQuestion({ question, subtitle, options, onSelect }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleContinue = () => {
    if (selected !== null) {
      onSelect(selected);
      // Reset selected for the next question automatically when it remounts or updates
      setSelected(null);
    }
  };

  return (
    <Animated.View 
      key={question} // Force remount for animations when question changes
      entering={FadeInDown.duration(500)}
      exiting={FadeOutUp.duration(400)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Text style={styles.questionText}>
            {question}
          </Text>
        </Animated.View>
        {subtitle && (
          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Text style={styles.subtitleText}>
              {subtitle}
            </Text>
          </Animated.View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {options.map((opt, i) => (
          <OptionButton
            key={opt.label}
            option={opt}
            index={i}
            isSelected={selected === i}
            onPress={() => setSelected(i)}
          />
        ))}
      </ScrollView>

      <Animated.Text entering={FadeInUp.duration(500).delay(600)} style={styles.helperText}>
        Your selections {"won't"} limit access to any features.
      </Animated.Text>

      <Animated.View
        entering={FadeInUp.duration(500).delay(700)}
        style={styles.buttonContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            selected === null && styles.continueButtonDisabled,
            pressed && selected !== null && { transform: [{ scale: 0.96 }], opacity: 0.9 },
          ]}
          disabled={selected === null}
          onPress={handleContinue}
        >
          <Text style={[styles.continueButtonText, selected === null && styles.continueTextDisabled]}>
            Continue
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// Separate component to handle per-option pulse animations
function OptionButton({ option, index, isSelected, onPress }: any) {
  // Glow effect animation
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isSelected]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.1)'),
      borderColor: withTiming(isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.15)'),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isSelected ? '#000000' : '#FFFFFF'),
    };
  });

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300 + index * 100)} style={styles.optionWrapper}>
      {/* Outer Pulse Glow */}
      <Animated.View style={[styles.glowRing, animatedGlowStyle]} />
      
      <Pressable onPress={onPress}>
        <Animated.View style={[styles.optionContent, animatedButtonStyle]}>
          <Animated.Text style={[styles.optionLabel, animatedTextStyle]}>
            {option.label}
          </Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  questionText: {
    fontFamily: theme.typography.display,
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  subtitleText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  optionWrapper: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
    marginVertical: 6,
  },
  glowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: theme.colors.healingGreen, // Using a green glow for selection
    transform: [{ scale: 1.05 }], // Slightly larger than the button
    filter: 'blur(8px)',
  },
  optionContent: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  helperText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#000000',
    letterSpacing: 1,
  },
  continueTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
});
