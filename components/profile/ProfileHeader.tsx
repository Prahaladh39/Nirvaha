import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Camera, User as UserIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';

export default function ProfileHeader() {
  const [name] = useState("Seeker");

  return (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={styles.container}
    >
      {/* Avatar Area */}
      <View style={styles.avatarWrapper}>
        {/* Outer glow ring */}
        <View style={styles.outerGlow} />
        
        {/* Inner gradient ring */}
        <LinearGradient
          colors={[theme.colors.healingGreen, theme.colors.gold]}
          style={styles.gradientRing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Avatar circle */}
        <View style={styles.avatarCircle}>
          <LinearGradient
            colors={['rgba(50, 140, 140, 0.15)', 'rgba(142, 164, 150, 0.2)']}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Simple Icon-based Avatar placeholder since SVG path conversion is complex */}
          <UserIcon size={48} color={theme.colors.healingGreen} strokeWidth={1} style={{ opacity: 0.7 }} />
          
          {/* Camera overlay */}
          <Pressable style={styles.cameraBtn}>
            <Camera size={12} color="#000000" />
          </Pressable>
        </View>
      </View>

      {/* Name & Info */}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>On your journey to clarity</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlow: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    left: -8,
    right: -8,
    borderRadius: 60,
    backgroundColor: 'rgba(50, 140, 140, 0.05)',
  },
  gradientRing: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 52,
    opacity: 0.3,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 140, 140, 0.1)',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
