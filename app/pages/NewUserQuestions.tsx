import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { theme } from '../../constants/theme';
import { ParticleOverlay } from '../../components/ParticleOverlay';
import OnboardingStepper from '../../components/onboarding/OnboardingStepper';
import { NEW_USER_QUESTIONS, NewUserOption } from '../../constants/newUserQuestions';
import { OnboardingEngine } from '../../services/onboarding/OnboardingEngine';

export default function NewUserQuestions() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const current = NEW_USER_QUESTIONS[currentStep];
  const totalSteps = NEW_USER_QUESTIONS.length;

  const handleContinue = async () => {
    if (selected === null) return;

    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    } else {
      // Final step: Save answers & recommendations
      setSaving(true);
      try {
        const user = auth.currentUser;
        let recommendationData = {};

        try {
          const engine = new OnboardingEngine(newAnswers);
          const rec = engine.getRecommendation();
          recommendationData = {
            recommendedFocus: rec.focus,
            recommendedTool: rec.tool,
          };
        } catch (calcError) {
          console.error('Error calculating recommendation in NewUserQuestions:', calcError);
        }

        if (user) {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              onboardingCompleted: true,
              onboardingAnswers: newAnswers,
              ...recommendationData,
            },
            { merge: true }
          );
        }

        Toast.show({
          type: 'success',
          text1: 'Space Created',
          text2: 'Your sanctuary awaits.',
        });

        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not save your preferences. Please try again.',
        });
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      setSelected(answers[prevStep] ?? null);
    } else {
      router.back();
    }
  };

  if (!current) return null;

  return (
    <ScreenContainer
      fullBleed
      statusBarStyle="light"
      background={
        <>
          {/* Background Gradient Simulator */}
          <View style={styles.backgroundGradient} />
          {/* Particle overlay for the magical feel */}
          <ParticleOverlay />
        </>
      }
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Back Button */}
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </Pressable>
      </Animated.View>

      <View style={styles.contentContainer}>
        <OnboardingStepper currentStep={currentStep} totalSteps={totalSteps} />

        <Animated.View
          key={currentStep} // Force re-render/remount animations per question step
          entering={FadeInDown.duration(500)}
          style={styles.questionContainer}
        >
          <View style={styles.textHeader}>
            <Animated.View entering={FadeInDown.duration(600).delay(100)}>
              <Text style={styles.questionText}>{current.question}</Text>
            </Animated.View>
            {current.subtitle && (
              <Animated.View entering={FadeInDown.duration(500).delay(200)}>
                <Text style={styles.subtitleText}>{current.subtitle}</Text>
              </Animated.View>
            )}
          </View>

          <ScrollView
            contentContainerStyle={styles.optionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {current.options.map((opt, i) => (
              <OptionButton
                key={opt.label}
                option={opt}
                index={i}
                isSelected={selected === i}
                onPress={() => setSelected(i)}
              />
            ))}
          </ScrollView>

          <Animated.View entering={FadeInUp.duration(500).delay(600)}>
            <Text style={styles.helperText}>
              Your selections {"won't"} limit access to any features.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(700)}
            style={styles.buttonContainer}
          >
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                (selected === null || saving) && styles.continueButtonDisabled,
                pressed && selected !== null && !saving && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
              disabled={selected === null || saving}
              onPress={handleContinue}
            >
              {saving ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text
                  style={[
                    styles.continueButtonText,
                    selected === null && styles.continueTextDisabled,
                  ]}
                >
                  {currentStep === totalSteps - 1 ? 'Finish' : 'Continue'}
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

interface OptionButtonProps {
  option: NewUserOption;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

function OptionButton({ option, index, isSelected, onPress }: OptionButtonProps) {
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
    <Animated.View
      entering={FadeInDown.duration(400).delay(300 + index * 100)}
      style={styles.optionWrapper}
    >
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
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C2E2A',
    opacity: 0.8,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  questionContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  textHeader: {
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
    backgroundColor: theme.colors.healingGreen,
    transform: [{ scale: 1.05 }],
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
