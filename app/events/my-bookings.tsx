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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Copy,
  ExternalLink,
  XCircle,
  AlertTriangle,
  Sparkles,
  BookmarkCheck,
  RotateCcw,
} from 'lucide-react-native';
import { BookingDocument, BookingStatus } from '../../types/bookings';
import { fetchMyBookings, cancelBooking } from '../../services/bookingsService';
import { theme } from '../../constants/theme';

type FilterTab = 'all' | 'confirmed' | 'past' | 'cancelled';

export default function MyBookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [selectedTab, setSelectedTab] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState<BookingDocument | null>(null);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const loadBookings = useCallback(async (showIndicator = true) => {
    try {
      if (showIndicator) setIsLoading(true);
      setErrorMessage(null);
      const data = await fetchMyBookings();
      setBookings(data || []);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Could not retrieve your bookings. Please check your network and try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings(true);
  }, [loadBookings]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadBookings(false);
  }, [loadBookings]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)' as any);
    }
  };

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

  const handleOpenEvent = (eventId: string) => {
    if (!eventId) return;
    router.push({
      pathname: '/events/[id]',
      params: { id: eventId },
    } as any);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    try {
      setIsSubmittingCancel(true);
      const updated = await cancelBooking(cancellingBooking.id, 'User cancelled from passbook');

      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? { ...b, status: 'cancelled' } : b))
      );

      Toast.show({
        type: 'success',
        text1: 'Booking Cancelled',
        text2: 'Your reservation has been cancelled and seat released.',
      });

      setCancellingBooking(null);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Cancellation Failed',
        text2: err?.message || 'Could not cancel booking. Please try again.',
      });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Filter bookings based on selected tab
  const now = new Date();
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isPast = b.eventStartDate ? new Date(b.eventStartDate) < now : false;

      if (selectedTab === 'confirmed') {
        return b.status === 'confirmed' && !isPast;
      }
      if (selectedTab === 'past') {
        return isPast || b.status === 'attended';
      }
      if (selectedTab === 'cancelled') {
        return b.status === 'cancelled';
      }
      return true; // 'all'
    });
  }, [bookings, selectedTab, now]);

  const renderStatusPill = (status: BookingStatus, isPast: boolean) => {
    if (status === 'cancelled') {
      return (
        <View style={[styles.statusPill, styles.statusCancelled]}>
          <Text style={[styles.statusText, { color: '#F87171' }]}>CANCELLED</Text>
        </View>
      );
    }
    if (status === 'attended' || isPast) {
      return (
        <View style={[styles.statusPill, styles.statusPast]}>
          <Text style={[styles.statusText, { color: 'rgba(255,255,255,0.6)' }]}>
            {status === 'attended' ? 'ATTENDED' : 'COMPLETED'}
          </Text>
        </View>
      );
    }
    if (status === 'waitlist') {
      return (
        <View style={[styles.statusPill, styles.statusWaitlist]}>
          <Text style={[styles.statusText, { color: theme.colors.gold }]}>WAITLIST</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusPill, styles.statusConfirmed]}>
        <Text style={[styles.statusText, { color: '#6EE7B7' }]}>CONFIRMED</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={handleBack}
          hitSlop={10}
        >
          <ChevronLeft size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>My Experiences</Text>
          <Text style={styles.headerSubtitle}>Personal Passbook & Reservations</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, selectedTab === 'all' && styles.tabItemActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All ({bookings.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, selectedTab === 'confirmed' && styles.tabItemActive]}
          onPress={() => setSelectedTab('confirmed')}
        >
          <Text style={[styles.tabText, selectedTab === 'confirmed' && styles.tabTextActive]}>
            Active
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, selectedTab === 'past' && styles.tabItemActive]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
            Past
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, selectedTab === 'cancelled' && styles.tabItemActive]}
          onPress={() => setSelectedTab('cancelled')}
        >
          <Text style={[styles.tabText, selectedTab === 'cancelled' && styles.tabTextActive]}>
            Cancelled
          </Text>
        </Pressable>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 24, 40) },
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
        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorCard}>
            <AlertTriangle size={18} color="#EF4444" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
            <Pressable style={styles.retryBtn} onPress={() => loadBookings(true)}>
              <RotateCcw size={13} color="#FFFFFF" />
              <Text style={styles.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Loading Spinner */}
        {isLoading && !isRefreshing && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={theme.colors.gold} />
            <Text style={styles.loadingText}>Opening your sacred passbook...</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !errorMessage && filteredBookings.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <BookmarkCheck size={36} color={theme.colors.gold} />
            </View>
            <Text style={styles.emptyTitle}>
              {selectedTab === 'all'
                ? 'No Reservations Yet'
                : selectedTab === 'confirmed'
                ? 'No Active Reservations'
                : selectedTab === 'past'
                ? 'No Past Gatherings'
                : 'No Cancelled Bookings'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'all' || selectedTab === 'confirmed'
                ? 'Explore our curated wellbeing retreats, sound baths, and mindfulness sessions to reserve your place.'
                : 'Your booking records will appear here.'}
            </Text>

            {(selectedTab === 'all' || selectedTab === 'confirmed') && (
              <Pressable
                style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}
                onPress={() => router.push('/events' as any)}
              >
                <Sparkles size={16} color={theme.colors.gold} />
                <Text style={styles.exploreBtnText}>Discover Gatherings</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Bookings List Cards */}
        {!isLoading &&
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
                ? 'Online Gathering'
                : booking.eventLocation?.venueName || 'Sacred Venue';

            return (
              <View key={booking.id} style={styles.bookingCard}>
                {/* Card Top Row: Status & Reference Code */}
                <View style={styles.cardHeader}>
                  {renderStatusPill(booking.status, isPast)}

                  <Pressable
                    style={styles.codeBadge}
                    onPress={() => handleCopyCode(booking.bookingReference)}
                    hitSlop={6}
                  >
                    <Text style={styles.codeText}>{booking.bookingReference}</Text>
                    <Copy size={11} color={theme.colors.gold} />
                  </Pressable>
                </View>

                {/* Event Title */}
                <Pressable onPress={() => handleOpenEvent(booking.eventId)}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {booking.eventTitle}
                  </Text>
                </Pressable>

                {/* Metadata Rows */}
                <View style={styles.metaContainer}>
                  <View style={styles.metaRow}>
                    <Calendar size={13} color={theme.colors.gold} />
                    <Text style={styles.metaText}>
                      {formattedDate} {formattedTime ? `• ${formattedTime}` : ''}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <MapPin size={13} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {locationStr}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Users size={13} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.metaText}>
                      {booking.participantCount}{' '}
                      {booking.participantCount === 1 ? 'Attendee' : 'Attendees'}
                    </Text>
                  </View>
                </View>

                {/* Card Actions Footer */}
                <View style={styles.cardActions}>
                  <Pressable
                    style={({ pressed }) => [styles.viewDetailsBtn, pressed && styles.pressed]}
                    onPress={() => handleOpenEvent(booking.eventId)}
                  >
                    <Text style={styles.viewDetailsText}>View Experience</Text>
                    <ExternalLink size={13} color="#FFFFFF" />
                  </Pressable>

                  {canCancel && (
                    <Pressable
                      style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
                      onPress={() => setCancellingBooking(booking)}
                    >
                      <XCircle size={13} color="#F87171" />
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>

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
          <View style={styles.modalDialog}>
            <View style={styles.modalIconBox}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Cancel Reservation?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to cancel your seat for{' '}
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {cancellingBooking?.eventTitle}
              </Text>
              ? This action will immediately release your spot for other seekers.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalSecondaryBtn, isSubmittingCancel && styles.disabledBtn]}
                onPress={() => setCancellingBooking(null)}
                disabled={isSubmittingCancel}
              >
                <Text style={styles.modalSecondaryText}>Keep Seat</Text>
              </Pressable>

              <Pressable
                style={[styles.modalDangerBtn, isSubmittingCancel && styles.disabledBtn]}
                onPress={handleConfirmCancel}
                disabled={isSubmittingCancel}
              >
                {isSubmittingCancel ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalDangerText}>Yes, Cancel</Text>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  tabItemActive: {
    backgroundColor: 'rgba(45, 90, 76, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(163, 189, 177, 0.35)',
  },
  tabText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: '#F87171',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  retryBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: '#FFFFFF',
  },
  centerState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.healingGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bookingCard: {
    backgroundColor: '#121915',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.35)',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusPast: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusWaitlist: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statusText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  codeBadge: {
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
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontFamily: theme.typography.display,
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 12,
  },
  metaContainer: {
    gap: 6,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewDetailsText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  cancelBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#F87171',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalDialog: {
    width: '100%',
    backgroundColor: '#161F1A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalSecondaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalDangerBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDangerText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
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

