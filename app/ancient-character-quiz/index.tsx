import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { Compass, X } from 'lucide-react-native';

export default function QuizWelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 50 : 20 }]}>
        <Pressable onPress={() => router.push('/')} style={styles.closeBtn}>
          <X color="#FFFFFF" size={24} />
        </Pressable>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Compass size={48} color={theme.colors.gold} />
        </View>
        <Text style={styles.title}>Check Your Ancient Character</Text>
        <Text style={styles.subtitle}>
          Answer a few questions to discover which ancient character qualities most reflect your present nature.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={styles.startBtn}
          onPress={() => router.push('/ancient-character-quiz/quiz')}
        >
          <Text style={styles.startBtnText}>Start Quiz</Text>
        </Pressable>
      </View>
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
    justifyContent: 'flex-end',
    padding: 20,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startBtn: {
    backgroundColor: theme.colors.gold,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 16,
    color: '#0A0A0A',
    fontWeight: '600',
  },
});
