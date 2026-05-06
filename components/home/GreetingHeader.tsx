import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { User } from 'lucide-react-native';
import { theme } from '../../constants/theme';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function GreetingHeader() {
  // Hardcoded unread count for UI purposes
  const unreadCount = 2;

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.subtitleText}>How are you feeling today?</Text>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.profileButton,
          pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
        ]}
      >
        <User size={20} color="rgba(255,255,255,0.7)" />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 20,
    marginTop: 60, // Top margin for safe area
  },
  textContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF453A', // iOS Destructive Red
    borderWidth: 2,
    borderColor: theme.colors.background,
  }
});
