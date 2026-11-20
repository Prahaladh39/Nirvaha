import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import {
  Calendar,
  MapPin,
  Users,
  Copy,
  ExternalLink,
  XCircle,
  AlertTriangle,
  Sparkles,
  TicketCheck,
  Search,
  X,
  RotateCcw,
  Compass,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { BookingDocument, BookingStatus } from '../../types/bookings';
import { EventDocument, EventCategory } from '../../types/events';
import { fetchMyBookings, cancelBooking } from '../../services/bookingsService';
import { fetchEvents } from '../../services/eventsService';
import { CategoryChips } from '../../components/events/CategoryChips';
import { EventCard } from '../../components/events/EventCard';
import { theme } from '../../constants/theme';
import { LAYOUT_TOKENS } from '../../components/ui/ScreenContainer';

type MainSection = 'my_bookings' | 'explore';
type BookingFilterTab = 'all' | 'confirmed' | 'past' | 'cancelled';

export default function BookingsTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Top Section Switcher: "my_bookings" vs "explore"
  const [activeSection, setActiveSection] = useState<MainSection>('my_bookings');

  // Bookings state
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [bookingFilter, setBookingFilter] = useState<BookingFilterTab>('all');
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Cancellation Modal state
  const [cancellingBooking, setCancellingBooking] = useState<BookingDocument | null>(null);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Explore Events state
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  // Pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load Bookings
  const loadBookings = useCallback(async (showIndicator = true) => {
    try {
      if (showIndicator) setIsLoadingBookings(true);
      setBookingError(null);
      const data = await fetchMyBookings();
      setBookings(data || []);
    } catch (err: any) {
      setBookingError(
        err?.message || 'Unable to load reservations. Please check your connection.'
      );
    } finally {
      setIsLoadingBookings(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load Events
  const loadEvents = useCallback(async (showIndicator = true) => {
    try {
      if (showIndicator) setIsLoadingEvents(true);
      setEventError(null);
      const filterParams: { status: 'published'; category?: string; search?: string } = {
        status: 'published',
      };
      if (selectedCategory !== 'all') filterParams.category = selectedCategory;
      if (searchQuery.trim().length > 0) filterParams.search = searchQuery.trim();

      const data = await fetchEvents(filterParams);
      setEvents(data || []);
    } catch (err: any) {
      setEventError(
        err?.message || 'Unable to connect to gatherings catalog.'
      );
    } finally {
      setIsLoadingEvents(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadBookings(true);
    loadEvents(true);
  }, [loadBookings, loadEvents]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (activeSection === 'my_bookings') {
      loadBookings(false);
    } else {
      loadEvents(false);
    }
  }, [activeSection, loadBookings, loadEvents]);

  const handleCopyCode = async (code: string) => {
    try {
      await Clipboard.setStringAsync(code);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Reference Copied',
        text2: `${code} copied to clipboard`,
        visibilityTime: 2000,
      });
    } catch {
      Toast.show({
        type: 'info',
        text1: 'Booking Reference',
        text2: code,
      });
    }
  };

  const handleViewTicket = (booking: BookingDocument) => {
    router.push({
      pathname: '/events/[id]/confirmation',
      params: {
        id: booking.eventId,
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        participantCount: String(booking.participantCount),
        eventTitle: booking.eventTitle,
        eventDate: booking.eventStartDate || '',
        eventLocation:
          booking.eventLocation?.type === 'online'
            ? 'Online Session'
            : booking.eventLocation?.venueName || 'Sanctuary',
      },
    } as any);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    try {
      setIsSubmittingCancel(true);
      const updated = await cancelBooking(cancellingBooking.id, 'Cancelled by user from passbook');
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? { ...b, status: 'cancelled' } : b))
      );
      Toast.show({
        type: 'success',
        text1: 'Reservation Cancelled',
        text2: 'Your seat has been released for other seekers.',
      });
      setCancellingBooking(null);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Cancellation Failed',
        text2: err?.message || 'Could not cancel booking.',
      });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Filter Bookings by tab
  const now = new Date();
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isPast = b.eventStartDate ? new Date(b.eventStartDate) < now : false;
      if (bookingFilter === 'confirmed') return b.status === 'confirmed' && !isPast;
      if (bookingFilter === 'past') return isPast || b.status === 'attended';
      if (bookingFilter === 'cancelled') return b.status === 'cancelled';
      return true;
    });
  }, [bookings, bookingFilter, now]);

  // Filter Events by category/search
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

  const confirmedCount = bookings.filter(
    (b) => b.status === 'confirmed' && (b.eventStartDate ? new Date(b.eventStartDate) >= now : true)
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 48) }]}>
        <View style={styles.headerTitleBox}>
          <View style={styles.titleWithIcon}>
            <TicketCheck size={22} color={theme.colors.gold} />
            <Text style={styles.headerTitle}>Experiences & Bookings</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Sacred gatherings, reservations & event passbook
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.catalogLinkBtn, pressed && styles.pressed]}
          onPress={() => router.push('/events' as any)}
          hitSlop={8}
        >
          <Compass size={14} color={theme.colors.gold} />
          <Text style={styles.catalogLinkText}>Full Catalog</Text>
        </Pressable>
      </View>

      {/* Main Switcher: My Bookings vs Explore Gatherings */}
      <View style={styles.sectionSwitcher}>
        <Pressable
          style={[
            styles.switchBtn,
            activeSection === 'my_bookings' && styles.switchBtnActive,
          ]}
          onPress={() => setActiveSection('my_bookings')}
        >
          <Text
            style={[
              styles.switchBtnText,
              activeSection === 'my_bookings' && styles.switchBtnTextActive,
            ]}
          >
            My Bookings {confirmedCount > 0 ? `(${confirmedCount})` : ''}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.switchBtn,
            activeSection === 'explore' && styles.switchBtnActive,
          ]}
          onPress={() => setActiveSection('explore')}
        >
          <Text
            style={[
              styles.switchBtnText,
              activeSection === 'explore' && styles.switchBtnTextActive,
            ]}
          >
            Explore & Reserve
          </Text>
        </Pressable>
      </View>

      {/* SECTION 1: MY BOOKINGS PASSBOOK */}
      {activeSection === 'my_bookings' && (
        <>
          {/* Sub-filter tabs */}
          <View style={styles.filterTabsRow}>
            {(['all', 'confirmed', 'past', 'cancelled'] as BookingFilterTab[]).map((tab) => {
              const labels = {
                all: `All (${bookings.length})`,
                confirmed: 'Active',
                past: 'Past',
                cancelled: 'Cancelled',
              };
              return (
                <Pressable
                  key={tab}
                  style={[
                    styles.filterPill,
                    bookingFilter === tab && styles.filterPillActive,
                  ]}
                  onPress={() => setBookingFilter(tab)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      bookingFilter === tab && styles.filterPillTextActive,
                    ]}
                  >
                    {labels[tab]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + LAYOUT_TOKENS.BOTTOM_NAV_HEIGHT + 24 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.gold}
                colors={[theme.colors.gold, theme.colors.healingGreen]}
              />
            }
          >
            {bookingError && (
              <View style={styles.errorBanner}>
                <AlertTriangle size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{bookingError}</Text>
                <Pressable style={styles.retryBtn} onPress={() => loadBookings(true)}>
                  <RotateCcw size={12} color="#FFFFFF" />
                  <Text style={styles.retryBtnText}>Retry</Text>
                </Pressable>
              </View>
            )}

            {isLoadingBookings && !isRefreshing && (
              <View style={styles.centerState}>
                <ActivityIndicator size="large" color={theme.colors.gold} />
                <Text style={styles.loadingText}>Loading your reservations...</Text>
              </View>
            )}

            {/* Empty State */}
            {!isLoadingBookings && !bookingError && filteredBookings.length === 0 && (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Sparkles size={32} color={theme.colors.gold} />
                </View>
                <Text style={styles.emptyTitle}>
                  {bookingFilter === 'all'
                    ? 'No Reservations Yet'
                    : bookingFilter === 'confirmed'
                    ? 'No Active Passes'
                    : bookingFilter === 'past'
                    ? 'No Past Gatherings'
                    : 'No Cancelled Bookings'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  Reserve sacred experiences, sound healings, and community retreats to have your entry passes saved right here.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.exploreCtaBtn, pressed && styles.pressed]}
                  onPress={() => setActiveSection('explore')}
                >
                  <Sparkles size={16} color={theme.colors.gold} />
                  <Text style={styles.exploreCtaText}>Explore Sacred Gatherings</Text>
                </Pressable>
              </View>
            )}

            {/* Bookings Passbook Cards */}
            {!isLoadingBookings &&
              filteredBookings.map((booking) => {
                const startDate = booking.eventStartDate ? new Date(booking.eventStartDate) : null;
                const isPast = startDate ? startDate < now : false;
                const canCancel = booking.status === 'confirmed' && !isPast;

                const formattedDate =
                  startDate && !isNaN(startDate.getTime())
                    ? startDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Date TBA';

                const formattedTime =
                  startDate && !isNaN(startDate.getTime())
                    ? startDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : '';

                const locationStr =
                  booking.eventLocation?.type === 'online'
                    ? 'Online Stream'
                    : booking.eventLocation?.venueName || 'Sanctuary';

                return (
                  <View key={booking.id} style={styles.bookingCard}>
                    {/* Header: Status + Reference Code */}
                    <View style={styles.cardHeaderRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          booking.status === 'confirmed'
                            ? styles.statusConfirmed
                            : booking.status === 'cancelled'
                            ? styles.statusCancelled
                            : styles.statusPast,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            booking.status === 'confirmed'
                              ? { color: '#6EE7B7' }
                              : booking.status === 'cancelled'
                              ? { color: '#F87171' }
                              : { color: 'rgba(255,255,255,0.6)' },
                          ]}
                        >
                          {booking.status === 'confirmed'
                            ? 'CONFIRMED'
                            : booking.status === 'cancelled'
                            ? 'CANCELLED'
                            : 'ATTENDED'}
                        </Text>
                      </View>

                      <Pressable
                        style={styles.codePill}
                        onPress={() => handleCopyCode(booking.bookingReference)}
                        hitSlop={8}
                      >
                        <Text style={styles.codePillText}>{booking.bookingReference}</Text>
                        <Copy size={11} color={theme.colors.gold} />
                      </Pressable>
                    </View>

                    {/* Title */}
                    <Pressable
                      onPress={() =>
                        router.push(('/events/' + booking.eventId) as any)
                      }
                    >
                      <Text style={styles.bookingTitle} numberOfLines={2}>
                        {booking.eventTitle}
                      </Text>
                    </Pressable>

                    {/* Meta info */}
                    <View style={styles.metaBox}>
                      <View style={styles.metaItem}>
                        <Calendar size={13} color={theme.colors.gold} />
                        <Text style={styles.metaItemText}>
                          {formattedDate} {formattedTime ? `• ${formattedTime}` : ''}
                        </Text>
                      </View>

                      <View style={styles.metaItem}>
                        <MapPin size={13} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.metaItemText} numberOfLines={1}>
                          {locationStr}
                        </Text>
                      </View>

                      <View style={styles.metaItem}>
                        <Users size={13} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.metaItemText}>
                          {booking.participantCount}{' '}
                          {booking.participantCount === 1 ? 'Seat' : 'Seats'}
                        </Text>
                      </View>
                    </View>

                    {/* Card Actions */}
                    <View style={styles.cardActionsRow}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.ticketPassBtn,
                          pressed && styles.pressed,
                        ]}
                        onPress={() => handleViewTicket(booking)}
                      >
                        <TicketCheck size={14} color={theme.colors.gold} />
                        <Text style={styles.ticketPassText}>View Pass</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.eventDetailsBtn,
                          pressed && styles.pressed,
                        ]}
                        onPress={() =>
                          router.push(('/events/' + booking.eventId) as any)
                        }
                      >
                        <Text style={styles.eventDetailsText}>Details</Text>
                        <ChevronRight size={14} color="rgba(255,255,255,0.6)" />
                      </Pressable>

                      {canCancel && (
                        <Pressable
                          style={({ pressed }) => [
                            styles.cancelSeatBtn,
                            pressed && styles.pressed,
                          ]}
                          onPress={() => setCancellingBooking(booking)}
                        >
                          <XCircle size={13} color="#F87171" />
                          <Text style={styles.cancelSeatText}>Cancel</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </>
      )}

      {/* SECTION 2: EXPLORE & RESERVE GATHERINGS */}
      {activeSection === 'explore' && (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + LAYOUT_TOKENS.BOTTOM_NAV_HEIGHT + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.gold}
              colors={[theme.colors.gold, theme.colors.healingGreen]}
            />
          }
        >
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Search size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search experiences, teachers, or venues..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <X size={15} color="rgba(255,255,255,0.6)" />
              </Pressable>
            )}
          </View>

          {/* Categories */}
          <View style={{ marginVertical: 8 }}>
            <CategoryChips
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </View>

          {eventError && (
            <View style={styles.errorBanner}>
              <AlertTriangle size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{eventError}</Text>
              <Pressable style={styles.retryBtn} onPress={() => loadEvents(true)}>
                <RotateCcw size={12} color="#FFFFFF" />
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          )}

          {isLoadingEvents && !isRefreshing && (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={theme.colors.gold} />
              <Text style={styles.loadingText}>Discovering sacred experiences...</Text>
            </View>
          )}

          {!isLoadingEvents && !eventError && filteredEvents.length === 0 && (
            <View style={styles.emptyCard}>
              <Compass size={36} color="rgba(212, 175, 55, 0.4)" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No Gatherings Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No experiences match "${searchQuery}". Try a different keyword.`
                  : 'New sessions and retreats are added regularly. Check back soon!'}
              </Text>
              {searchQuery ? (
                <Pressable
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchBtnText}>Clear Search</Text>
                </Pressable>
              ) : null}
            </View>
          )}

          {/* Events List */}
          {!isLoadingEvents &&
            filteredEvents.map((event) => (
              <View key={event.id} style={{ marginBottom: 14 }}>
                <EventCard event={event} variant="default" />
              </View>
            ))}
        </ScrollView>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal
        visible={cancellingBooking !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isSubmittingCancel) setCancellingBooking(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconCircle}>
              <AlertTriangle size={30} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Cancel Reservation?</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to release your seat for{' '}
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {cancellingBooking?.eventTitle}
              </Text>
              ? This action is immediate and gives your spot to fellow community members.
            </Text>

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalKeepBtn, isSubmittingCancel && styles.disabledBtn]}
                onPress={() => setCancellingBooking(null)}
                disabled={isSubmittingCancel}
              >
                <Text style={styles.modalKeepText}>Keep Reservation</Text>
              </Pressable>

              <Pressable
                style={[styles.modalConfirmBtn, isSubmittingCancel && styles.disabledBtn]}
                onPress={handleConfirmCancel}
                disabled={isSubmittingCancel}
              >
                {isSubmittingCancel ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Yes, Cancel</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitleBox: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
  },
  catalogLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  catalogLinkText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  sectionSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  switchBtnActive: {
    backgroundColor: theme.colors.healingGreen,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  switchBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  switchBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  filterPillText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filterPillTextActive: {
    fontFamily: theme.typography.bodyMedium,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: theme.typography.body,
    fontSize: 13,
    height: '100%',
  },
  bookingCard: {
    backgroundColor: '#121915',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.35)',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusPast: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusBadgeText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  codePillText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  bookingTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 10,
  },
  metaBox: {
    gap: 5,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItemText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  ticketPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  ticketPassText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  eventDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  eventDetailsText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: '#FFFFFF',
  },
  cancelSeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
  },
  cancelSeatText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: '#F87171',
  },
  emptyCard: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#101712',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.healingGreen,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreCtaText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clearSearchBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  clearSearchBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.gold,
  },
  centerState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#F87171',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  retryBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#161F1A',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: theme.typography.display,
    fontSize: 19,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalKeepBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalKeepText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: '#FFFFFF',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

