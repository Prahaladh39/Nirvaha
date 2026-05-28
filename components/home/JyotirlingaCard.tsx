import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { Map, Sparkles, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function JyotirlingaCard() {
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(800)} style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.card,
          pressed && { transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => router.push('/jyotirlingas')}
      >
        <LinearGradient 
          colors={['rgba(212, 175, 55, 0.15)', 'rgba(0,0,0,0.4)']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill} 
          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 24 }}
        />
        
        <View style={styles.iconContainer}>
          <Map size={24} color={theme.colors.gold} />
          <View style={styles.sparkleContainer}>
            <Sparkles size={12} color="#FFF" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>The 12 Jyotirlingas</Text>
          <Text style={styles.subtitle}>Explore the sacred geography of India</Text>
        </View>

        <View style={styles.arrowContainer}>
          <ChevronRight size={20} color="rgba(255,255,255,0.4)" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: '#12100E',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
