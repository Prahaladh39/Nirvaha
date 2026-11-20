import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { EventDocument } from '../../types/events';
import { fetchEvents } from '../../services/eventsService';
import { EventCard } from '../events/EventCard';
import { theme } from '../../constants/theme';

export default function EventsRail() {
  const router = useRouter();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchEvents({ status: 'published', limit: 6 });
      setEvents(data || []);
    } catch (error) {
      console.warn('EventsRail failed to fetch events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSeeAll = () => {
    router.push('/events' as any);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.gold} />
      </View>
    );
  }

  // Gracefully hide rail if no published events exist yet
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Title & See All */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles size={16} color={theme.colors.gold} style={styles.sparkleIcon} />
          <Text style={styles.title}>Experiences & Gatherings</Text>
        </View>

        <Pressable
          onPress={handleSeeAll}
          style={({ pressed }) => [styles.seeAllButton, pressed && styles.buttonPressed]}
          hitSlop={8}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={14} color={theme.colors.gold} />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        Sacred retreats, sound immersions & community circles
      </Text>

      {/* Horizontal Rail of Event Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {events.map((event) => (
          <View key={event.id} style={styles.cardWrapper}>
            <EventCard event={event} variant="rail" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  loadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIcon: {
    marginRight: 6,
  },
  title: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrapper: {
    width: 290,
  },
});

