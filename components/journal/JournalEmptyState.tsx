import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookOpen } from 'lucide-react-native';
import { theme } from '../../constants/theme';

interface JournalEmptyStateProps {
  onStart: () => void;
}

export default function JournalEmptyState({ onStart }: JournalEmptyStateProps) {
  return (
    <Animated.View 
      entering={FadeInDown.duration(600)}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <BookOpen size={28} color={theme.colors.primary} />
      </View>
      
      <Text style={styles.title}>Your reflections begin here</Text>
      
      <Text style={styles.subtitle}>
        Writing helps you understand your feelings. Start with whatever comes to mind.
      </Text>
      
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }
        ]}
        onPress={onStart}
      >
        <Text style={styles.buttonText}>Write your first reflection</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 82, 77, 0.15)', // Healing green tint
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primaryForeground,
  }
});
