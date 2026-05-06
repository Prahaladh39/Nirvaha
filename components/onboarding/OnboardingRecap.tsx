import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { auth, db } from '../../config/firebase';
import { questions } from '../../constants/onboardingData';
import { theme } from '../../constants/theme';

interface Props {
  answers: number[];
}

const recapLabels = [
  "Your focus is",
  "When stressed, you",
  "You're seeking",
  "You'll explore through",
  "You'll start with"
];

export default function OnboardingRecap({ answers }: Props) {
  const [saving, setSaving] = useState(false);

  const handleEnterNirvaha = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Save answers to Firestore (using setDoc with merge handles missing documents)
        await setDoc(doc(db, 'users', user.uid), {
          onboardingCompleted: true,
          onboardingAnswers: answers,
        }, { merge: true });
      }
      
      // Navigate to the main home screen (to be built next)
      // For now, let's just log and show toast
      Toast.show({ type: 'success', text1: 'Space Created', text2: 'Your sanctuary awaits.' });
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
      
    } catch (error: any) {
      console.error("Error saving onboarding data:", error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not save your preferences.' });
      setSaving(false); // only re-enable if it failed
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(600)}
      exiting={FadeOutUp.duration(500)}
      style={styles.container}
    >
      <Animated.Text 
        entering={FadeInDown.duration(600).delay(200)}
        style={styles.heading}
      >
        So, to recap
      </Animated.Text>

      <ScrollView contentContainerStyle={styles.recapList} showsVerticalScrollIndicator={false}>
        {answers.map((answerIdx, qIdx) => {
          const q = questions[qIdx];
          if (!q || answerIdx == null) return null;
          const chosen = q.options[answerIdx];
          if (!chosen) return null;

          return (
            <Animated.View
              key={qIdx}
              entering={FadeInDown.duration(400).delay(300 + qIdx * 120)}
              style={styles.recapCard}
            >
              <Text style={styles.recapLabel}>
                {recapLabels[qIdx] || "You chose"}
              </Text>
              <Text style={styles.recapValue}>
                {chosen.label}
              </Text>
            </Animated.View>
          );
        })}
      </ScrollView>

      <Animated.View
        entering={FadeInUp.duration(500).delay(1000)}
        style={styles.buttonContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.enterButton,
            pressed && !saving && { transform: [{ scale: 0.96 }], opacity: 0.9 },
          ]}
          onPress={handleEnterNirvaha}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.enterButtonText}>Enter Nirvaha</Text>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },
  heading: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  recapList: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recapCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  recapLabel: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  recapValue: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  enterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    maxWidth: 240,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  enterButtonText: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#000000',
    letterSpacing: 1,
  },
});
