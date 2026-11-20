import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import { EventDocument, EventCategory } from '../../types/events';
import { fetchEvents } from '../../services/eventsService';
import { CategoryChips } from '../../components/events/CategoryChips';
import { EventCard } from '../../components/events/EventCard';

export default function EventsDiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [events, setEvents] = useState<EventDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadEvents = useCallback(
    async (showLoadingIndicator = true) => {
      try {
        if (showLoadingIndicator) setIsLoading(true);
        setErrorMessage(null);

        const filterParams: {
          category?: string;
          search?: string;
          status: 'published';
        } = {
          status: 'published',
        };

        if (selectedCategory !== 'all') {
          filterParams.category = selectedCategory;
        }

        if (searchQuery.trim().length > 0) {
          filterParams.search = searchQuery.trim();
        }

        const data = await fetchEvents(filterParams);
        setEvents(data || []);
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'Unable to connect to events service. Please check your network and try again.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedCategory, searchQuery]
  );

  useEffect(() => {
    loadEvents(true);
  }, [loadEvents]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadEvents(false);
  }, [loadEvents]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetCategory = () => {
    setSelectedCategory('all');
  };

  // Client-side additional filtering for instant responsiveness
  const filteredEvents = useMemo(() => {
    let result = events;

    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.shortDescription?.toLowerCase().includes(q) ||
          e.location?.venueName?.toLowerCase().includes(q) ||
          e.organizer?.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [events, selectedCategory, searchQuery]);

  // Separate featured hero event from the rest
  const { heroEvent, regularEvents } = useMemo(() => {
    const featured = filteredEvents.find((e) => e.isFeatured);
    if (featured) {
      return {
        heroEvent: featured,
        regularEvents: filteredEvents.filter((e) => e.id !== featured.id),
      };
    }
    return {
      heroEvent: null,
      regularEvents: filteredEvents,
    };
  }, [filteredEvents]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Discover Experiences</Text>
          <Text style={styles.headerSubtitle}>
            Sacred gatherings, wellness & mindfulness
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color="rgba(255, 255, 255, 0.45)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, teacher, or practice..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={handleClearSearch}
              style={styles.clearSearchButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <X size={16} color="rgba(255, 255, 255, 0.6)" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Chips Filter */}
      <View style={styles.categorySection}>
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </View>

      {/* Scrollable Event Content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#D4AF37"
            colors={['#D4AF37', '#2D5A4C']}
          />
        }
      >
        {/* Error State Banner with Retry */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <View style={styles.errorIconWrapper}>
              <AlertTriangle size={20} color="#EF4444" />
            </View>
            <View style={styles.errorTextWrapper}>
              <Text style={styles.errorTitle}>Connection Issue</Text>
              <Text style={styles.errorDescription}>{errorMessage}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
              onPress={() => loadEvents(true)}
              accessibilityRole="button"
              accessibilityLabel="Retry loading events"
            >
              <RotateCcw size={14} color="#D4AF37" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Loading Spinner */}
        {isLoading && !isRefreshing && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingStateText}>
              Connecting to sacred gatherings...
            </Text>
          </View>
        )}

        {/* Empty States */}
        {!isLoading && !errorMessage && filteredEvents.length === 0 && (
          <View style={styles.centerState}>
            {searchQuery.trim().length > 0 ? (
              <>
                <Search size={44} color="rgba(212, 175, 55, 0.4)" style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>No matching experiences</Text>
                <Text style={styles.emptySubtitle}>
                  We couldn't find any gatherings matching "{searchQuery.trim()}".
                </Text>
                <Pressable
                  style={styles.emptyActionButton}
                  onPress={handleClearSearch}
                  accessibilityRole="button"
                >
                  <Text style={styles.emptyActionText}>Clear Search</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Sparkles size={44} color="rgba(212, 175, 55, 0.4)" style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>No events in this category</Text>
                <Text style={styles.emptySubtitle}>
                  New sessions and retreats are frequently added. Check back soon or explore other categories.
                </Text>
                {selectedCategory !== 'all' && (
                  <Pressable
                    style={styles.emptyActionButton}
                    onPress={handleResetCategory}
                    accessibilityRole="button"
                  >
                    <Text style={styles.emptyActionText}>Explore All Categories</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}

        {/* Results List */}
        {!isLoading && filteredEvents.length > 0 && (
          <>
            {/* Featured Hero Card (if present) */}
            {heroEvent && (
              <View style={styles.heroSection}>
                <View style={styles.sectionHeadingRow}>
                  <Sparkles size={16} color="#D4AF37" />
                  <Text style={styles.sectionHeading}>Featured Journey</Text>
                </View>
                <EventCard event={heroEvent} variant="hero" />
              </View>
            )}

            {/* Upcoming Regular Events */}
            {regularEvents.length > 0 && (
              <View style={styles.listSection}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionHeading}>
                    {heroEvent ? 'More Gatherings' : 'Upcoming Gatherings'}
                  </Text>
                  <Text style={styles.countBadge}>{filteredEvents.length} events</Text>
                </View>

                {regularEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="default" />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    height: '100%',
  },
  clearSearchButton: {
    padding: 6,
  },
  categorySection: {
    paddingVertical: 8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSection: {
    marginBottom: 8,
  },
  listSection: {
    marginTop: 4,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  countBadge: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  errorIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTextWrapper: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#F87171',
    marginBottom: 2,
  },
  errorDescription: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  retryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#D4AF37',
  },
  // Center Loading & Empty States
  centerState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  loadingStateText: {
    marginTop: 14,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  emptyActionText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#D4AF37',
  },
});
