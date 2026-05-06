import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Wind, PenLine, Lightbulb, ArrowUpRight } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { router } from 'expo-router';

const actions = [
  {
    title: 'Ground your thoughts',
    subtitle: '2 min calm reset',
    icon: Wind,
    colors: {
      bg: '#162828',
      iconBg: 'rgba(50, 140, 140, 0.2)',
      iconColor: '#A0D6D6',
    }
  },
  {
    title: 'Reflect & journal',
    subtitle: 'Let it out',
    icon: PenLine,
    route: '/(tabs)/journal',
    colors: {
      bg: '#332A1C',
      iconBg: 'rgba(180, 120, 60, 0.2)',
      iconColor: '#D6C0A0',
    }
  },
  {
    title: 'A new perspective',
    subtitle: 'See it differently',
    icon: Lightbulb,
    colors: {
      bg: '#241D33',
      iconBg: 'rgba(120, 80, 180, 0.2)',
      iconColor: '#C0A0D6',
    }
  }
];

export default function SmartActions() {
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.container}>
      <Text style={styles.sectionTitle}>A small step is enough</Text>

      <View style={styles.grid}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Pressable 
              key={action.title} 
              style={[styles.card, { backgroundColor: action.colors.bg }]}
              onPress={() => {
                if (action.route) router.push(action.route as any);
              }}
            >
              <View style={styles.topRow}>
                <View style={[styles.iconWrapper, { backgroundColor: action.colors.iconBg }]}>
                  <Icon size={16} color={action.colors.iconColor} />
                </View>
                <ArrowUpRight size={14} color="rgba(255,255,255,0.4)" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 100, // Extra padding for bottom nav
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 'auto',
  },
  cardTitle: {
    fontFamily: theme.typography.display,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 16,
  },
  cardSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 14,
  }
});
