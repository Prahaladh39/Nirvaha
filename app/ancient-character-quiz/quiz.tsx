import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { QUESTIONS, QuizOption } from '../../constants/ancientCharacterQuizData';
import { X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function QuizScreen() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  
  const question = QUESTIONS[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (option: QuizOption) => {
    // Add weights to scores
    const newScores = { ...scores };
    Object.keys(option.weight).forEach(char => {
      newScores[char] = (newScores[char] || 0) + option.weight[char];
    });
    setScores(newScores);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      calculateAndNavigate(newScores);
    }
  };

  const calculateAndNavigate = (finalScores: Record<string, number>) => {
    const sortedChars = Object.keys(finalScores).sort((a, b) => finalScores[b] - finalScores[a]);
    const primaryMatch = sortedChars[0];
    const secondaryMatch = sortedChars[1];

    const primaryScore = finalScores[primaryMatch] || 0;
    const totalPointsGiven = Object.values(finalScores).reduce((a, b) => a + b, 0);
    
    let rawPercentage = (primaryScore / totalPointsGiven) * 100;
    // Map it up slightly to make the clamp feel more natural (e.g. max theoretical is 30/40 = 75%)
    // But we will follow instructions exactly: clamp between 76-94
    let matchPercentage = Math.round(rawPercentage);
    
    // Personality quizzes often scale scores. To avoid everything just being '76', 
    // let's apply a multiplier so it falls nicely into the 76-94 range.
    // If max primary score is ~30 (75%), let's multiply raw percentage by 1.2 => ~90%.
    matchPercentage = Math.round(rawPercentage * 1.2);
    
    matchPercentage = Math.max(76, Math.min(94, matchPercentage));

    router.push({
      pathname: '/ancient-character-quiz/result',
      params: {
        primary: primaryMatch,
        secondary: secondaryMatch,
        percentage: matchPercentage
      }
    });
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <X color="#FFFFFF" size={24} />
        </Pressable>
        <Text style={styles.progressText}>Question {currentQuestionIdx + 1} of {QUESTIONS.length}</Text>
        <View style={{ width: 44 }} /> {/* Spacer */}
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          key={currentQuestionIdx} 
          entering={FadeIn.duration(400)} 
          exiting={FadeOut.duration(200)}
        >
          <Text style={styles.questionText}>{question.text}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <Pressable 
                key={index} 
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionCardPressed
                ]}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 30,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questionText: {
    fontFamily: theme.typography.display,
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 32,
    lineHeight: 34,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  optionCardPressed: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  optionText: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
});
