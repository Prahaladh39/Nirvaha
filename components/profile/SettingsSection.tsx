import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsSection() {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(350)}
      style={styles.container}
    >
      <View style={styles.quickActions}>
        <Pressable 
          style={styles.quickActionBtn}
          onPress={() => router.push('/chat')}
        >
          <LinearGradient
            colors={['rgba(50, 140, 140, 0.1)', 'rgba(235, 185, 80, 0.06)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.quickActionTextPrimary}>Talk to Nirvaha</Text>
        </Pressable>
        
        <Pressable 
          style={styles.quickActionBtn}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <LinearGradient
            colors={['rgba(235, 185, 80, 0.1)', 'rgba(142, 164, 150, 0.06)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.quickActionText}>Write a journal</Text>
        </Pressable>
      </View>

      <Pressable 
        style={styles.logoutBtn}
        onPress={() => router.replace('/pages/Auth')}
      >
        <LogOut size={14} color="rgba(255,255,255,0.4)" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 40,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  quickActionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickActionText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  quickActionTextPrimary: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  logoutText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
});
