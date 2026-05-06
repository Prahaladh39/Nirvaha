import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MessageCircle, BookOpen, Wind, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';

interface WellnessActionsProps {
  avgMood: number;
}

export default function WellnessActions({ avgMood }: WellnessActionsProps) {
  const actions = avgMood < 3
    ? [
        { id: 1, icon: MessageCircle, label: "Talk to Nirvaha", sub: "Share how you're feeling", route: "/(tabs)/chat" },
        { id: 2, icon: Wind, label: "Calming practice", sub: "2-minute breathing exercise", route: "/(tabs)/collection" },
      ]
    : [
        { id: 3, icon: BookOpen, label: "Write a reflection", sub: "Capture this week's insights", route: "/(tabs)/journal" },
        { id: 4, icon: Sparkles, label: "Wisdom Selfie", sub: "Express your inner journey", route: "/(tabs)/collection" },
      ];

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(450)} style={styles.container}>
      <Text style={styles.sectionTitle}>SUGGESTED FOR YOU</Text>
      
      <View style={styles.actionsList}>
        {actions.map((action, i) => (
          <Animated.View key={action.id} entering={FadeInDown.duration(400).delay(500 + i * 100)}>
            <Pressable 
              style={({ pressed }) => [
                styles.actionCard,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => router.push(action.route as any)}
            >
              <View style={styles.iconWrapper}>
                <action.icon size={20} color={theme.colors.primaryForeground} />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>{action.label}</Text>
                <Text style={styles.sub}>{action.sub}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontFamily: theme.typography.body,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sub: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  }
});
