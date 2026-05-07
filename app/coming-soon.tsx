import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const thoughts = [
  "The soul always knows what to do to heal itself. The challenge is to silence the mind.",
  "Quiet the mind, and the soul will speak.",
  "Your sacred space is where you can find yourself again and again.",
  "The universe is not outside of you. Look inside; everything that you want, you already are.",
  "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.",
  "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.",
  "The light you seek is already within you. Let it shine.",
  "Wisdom begins in wonder."
];

export default function ComingSoonScreen() {
  const randomThought = useMemo(() => {
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />
      
      {/* Ambient Orbs */}
      <View style={[styles.orb, styles.orbOne]} />
      <View style={[styles.orb, styles.orbTwo]} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.iconContainer}>
          <Sparkles size={48} color={theme.colors.gold} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.duration(600).delay(200)} style={styles.title}>
          Coming Soon
        </Animated.Text>
        
        <Animated.Text entering={FadeInDown.duration(600).delay(300)} style={styles.subtitle}>
          We're crafting something special for your inner journey.
        </Animated.Text>

        <Animated.View entering={FadeInUp.duration(800).delay(500)} style={styles.thoughtCard}>
          <View style={styles.quoteMark}>
            <Text style={styles.quoteText}>"</Text>
          </View>
          <Text style={styles.thoughtText}>{randomThought}</Text>
          <View style={[styles.quoteMark, styles.quoteMarkEnd]}>
            <Text style={styles.quoteText}>"</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(800)}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orbOne: {
    width: 300,
    height: 300,
    top: -50,
    right: -50,
    backgroundColor: theme.colors.gold,
  },
  orbTwo: {
    width: 250,
    height: 250,
    bottom: -50,
    left: -50,
    backgroundColor: theme.colors.healingGreen,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  thoughtCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 40,
    position: 'relative',
  },
  quoteMark: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  quoteMarkEnd: {
    top: undefined,
    left: undefined,
    bottom: 0,
    right: 20,
  },
  quoteText: {
    fontSize: 48,
    fontFamily: theme.typography.display,
    color: 'rgba(212, 175, 55, 0.2)',
  },
  thoughtText: {
    fontFamily: theme.typography.body,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});
