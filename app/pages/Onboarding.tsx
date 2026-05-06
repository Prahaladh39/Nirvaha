import React, { useState } from 'react';
import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ParticleOverlay } from '../../components/ParticleOverlay';
import OnboardingStepper from '../../components/onboarding/OnboardingStepper';
import OnboardingQuestion from '../../components/onboarding/OnboardingQuestion';
import OnboardingRecap from '../../components/onboarding/OnboardingRecap';
import { questions } from '../../constants/onboardingData';
import { theme } from '../../constants/theme';

type Phase = 'questions' | 'recap';

export default function Onboarding() {
  const [phase, setPhase] = useState<Phase>('questions');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  const current = questions[step];

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (step + 1 >= questions.length) {
      setPhase('recap');
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (phase === 'recap') {
      setPhase('questions');
      setStep(questions.length - 1);
      setAnswers((prev) => prev.slice(0, -1));
    } else if (phase === 'questions' && step > 0) {
      setStep((s) => s - 1);
      setAnswers((prev) => prev.slice(0, -1));
    } else if (phase === 'questions' && step === 0) {
      // Go back to intro screen
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background Gradient Simulator */}
      <View style={styles.backgroundGradient} />
      
      {/* Reusing the ParticleOverlay for the magical feel */}
      <ParticleOverlay />

      {/* Back Button */}
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color="#FFFFFF" size={28} />
        </Pressable>
      </Animated.View>

      <View style={styles.contentContainer}>
        {phase === 'questions' && current && (
          <View style={styles.phaseWrapper}>
            <OnboardingStepper currentStep={step} totalSteps={questions.length} />
            <OnboardingQuestion
              key={step} // Force remount to trigger entrance animations
              question={current.question}
              subtitle={current.subtitle}
              options={current.options}
              onSelect={handleSelect}
            />
          </View>
        )}

        {phase === 'recap' && (
          <View style={styles.phaseWrapper}>
            <OnboardingRecap answers={answers} />
          </View>
        )}
      </View>
    </SafeAreaView>
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
    paddingTop: 100, // Make room for back button and stepper
    paddingHorizontal: 16,
  },
  phaseWrapper: {
    flex: 1,
    width: '100%',
  },
});
