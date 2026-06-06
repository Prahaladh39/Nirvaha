import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '../../constants/theme';
import { companionsData } from '../../constants/companionsData';
import CompanionCard from '../companions/CompanionCard';

export default function CompanionRail() {
  const visibleCompanions = companionsData.slice(0, 5);

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Companions</Text>
          <Text style={styles.subtitle}>Real humans, ready to listen</Text>
        </View>
        <Pressable 
          style={styles.viewAllBtn}
          onPress={() => router.push('/companions')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={12} color={theme.colors.gold} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleCompanions.map((companion) => (
          <CompanionCard 
            key={companion.id} 
            companion={companion} 
            width={140}
            height={190}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(235, 185, 80, 0.1)',
    borderColor: 'rgba(235, 185, 80, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  viewAllText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: theme.colors.gold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
});
