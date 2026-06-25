import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { X } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AssessmentEngine } from '../../services/assessment/AssessmentEngine';
import { AssessmentOption } from '../../services/assessment/AssessmentQuestions';

export default function QuizScreen() {
  const [engine] = useState(() => new AssessmentEngine());
  const [currentIndex, setCurrentIndex] = useState(0);

  const question = engine.getCurrentQuestion();
  const totalQuestions = engine.getQuestionsCount();
  const progress = (currentIndex / totalQuestions) * 100;

  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 400 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  const handleOptionSelect = (option: AssessmentOption) => {
    const resultPayload = engine.selectOption(option);
    
    if (resultPayload) {
      progressAnim.value = withTiming(100, { duration: 300 });
      setTimeout(() => {
        router.push({
          pathname: '/ancient-character-quiz/result',
          params: {
            primary: resultPayload.primary,
            secondary: resultPayload.secondary,
            percentage: resultPayload.percentage
          }
        });
      }, 350);
    } else {
      setCurrentIndex(engine.getCurrentIndex());
    }
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
        <Text style={styles.progressText}>Question {currentIndex + 1} of {totalQuestions}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          key={currentIndex} 
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
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  optionCardPressed: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  optionText: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});
