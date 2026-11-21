import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Globe,
  Users,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react-native';
import { EventDocument, getComputedEventStatus } from '../../../types/events';
import { fetchEventById } from '../../../services/eventsService';
import { StatusBadge } from '../../../components/events/StatusBadge';
import { theme } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<string, string> = {
  yoga: 'Yoga & Movement',
  meditation: 'Meditation',
  sound_healing: 'Sound Healing',
  wellness_workshops: 'Wellness Workshop',
  retreats: 'Retreat',
  community_experiences: 'Community Satsang',
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [event, setEvent] = useState<EventDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNetworkFailure, setIsNetworkFailure] = useState(false);

  const loadEvent = useCallback(async () => {
    if (!id) {
      setErrorMessage('Event identifier is missing.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNetworkFailure(false);

      const data = await fetchEventById(id);
      if (!data) {
        setErrorMessage('This experience could not be found or has been retired.');
      } else {
        setEvent(data);
      }
    } catch (err: any) {
      const isNet =
        err?.name === 'NetworkError' ||
        err?.name === 'TimeoutError' ||
        err?.message?.toLowerCase().includes('network') ||
        err?.message?.toLowerCase().includes('connection') ||
        err?.message?.toLowerCase().includes('offline');

      setIsNetworkFailure(Boolean(isNet));
      setErrorMessage(
        isNet
          ? 'Network connection issue. Please check your connection and tap retry.'
          : err?.message || 'Failed to load experience details. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/events' as any);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        title: event.title,
        message: `Join me at ${event.title} on Nirvaha: Sacred wellness experiences and gatherings.`,
      });
    } catch (error) {
      console.warn('Error sharing event:', error);
    }
  };

  const handleOpenExternal = async (url?: string) => {
    const targetUrl = url || event?.bookingConfig?.externalUrl;
    if (!targetUrl) {
      Toast.show({
        type: 'info',
        text1: 'External Link Unavailable',
        text2: 'No registration URL was configured for this event.',
      });
      return;
    }
    try {
      let formatted = targetUrl.trim();
      if (!/^https?:\/\//i.test(formatted)) {
        formatted = `https://${formatted}`;
      }
      await WebBrowser.openBrowserAsync(formatted);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could Not Open Link',
        text2: 'Please verify the URL or try again later.',
      });
    }
  };

  const handleBookNow = () => {
    if (!event) return;
    router.push({
      pathname: '/events/[id]/register',
      params: { id: event.id },
    } as any);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.centeredContainer, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={theme.colors.gold} />
          <Text style={styles.loadingText}>Loading sacred experience...</Text>
        </View>
      </View>
    );
  }

  // 2. Error / Unavailable State
  if (errorMessage || !event) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Custom Dark Header for error screen */}
        <View style={[styles.darkHeader, { paddingTop: Math.max(insets.top, 12) }]}>
          <Pressable
            style={({ pressed }) => [styles.headerIconBtn, pressed && styles.btnPressed]}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Back to experiences"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.darkHeaderTitle}>Experience Details</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.centeredContainer}>
          <AlertCircle
            size={52}
            color={isNetworkFailure ? '#EAB308' : '#EF4444'}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.errorTitle}>
            {isNetworkFailure ? 'Connection Issue' : 'Experience Unavailable'}
          </Text>
          <Text style={styles.errorDescription}>
            {errorMessage || 'This experience could not be found or has been retired.'}
          </Text>

          <View style={styles.errorActionRow}>
            {isNetworkFailure ? (
              <Pressable
                style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
                onPress={loadEvent}
              >
                <RotateCcw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            ) : null}

            <Pressable
              style={({ pressed }) => [styles.backHomeButton, pressed && styles.btnPressed]}
              onPress={handleBack}
            >
              <Text style={styles.backHomeButtonText}>Back to Experiences</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const computedStatus = getComputedEventStatus(event);
  const isCancelled = computedStatus === 'cancelled';
  const isClosed = computedStatus === 'registration_closed';
  const isFullyBooked = computedStatus === 'fully_booked';

  // Format dates & times
  const startDate = new Date(event.schedule?.startDate);
  const endDate = new Date(event.schedule?.endDate);
  const isValidDate = !isNaN(startDate.getTime());

  const formattedDate = isValidDate
    ? startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  const formattedStartTime = isValidDate
    ? startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  const formattedEndTime = !isNaN(endDate.getTime())
    ? endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  const timeRange = formattedEndTime ? `${formattedStartTime} - ${formattedEndTime}` : formattedStartTime;

  // Capacity calculations
  const capacity = event.bookingConfig?.capacity || 0;
  const currentAttendees = event.attendeeCount || 0;
  const remainingSpots = Math.max(0, capacity - currentAttendees);
  const hasLimitedCapacity = capacity > 0;

  // Location display
  const isOnline = event.location?.type === 'online';
  const isHybrid = event.location?.type === 'hybrid';
  const locationLabel = isOnline ? 'Online Gathering' : isHybrid ? 'Hybrid Experience' : 'In-Person Sanctuary';

  // Render Dynamic Action Button
  const renderActionButton = () => {
    if (isCancelled) {
      return (
        <View style={[styles.actionBtn, styles.actionBtnDisabled, { backgroundColor: '#3A1414' }]}>
          <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Event Cancelled</Text>
        </View>
      );
    }

    if (isClosed) {
      return (
        <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
          <Text style={styles.actionBtnTextDisabled}>Registration Closed</Text>
        </View>
      );
    }

    if (isFullyBooked) {
      return (
        <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
          <Text style={styles.actionBtnTextDisabled}>Fully Booked</Text>
        </View>
      );
    }

    // A. Advertisement Listing
    if (event.listingType === 'advertisement') {
      return (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.btnPressed]}
          onPress={() => handleOpenExternal()}
        >
          <Text style={styles.actionBtnTextPrimary}>Learn More</Text>
          <ExternalLink size={18} color="#FFFFFF" />
        </Pressable>
      );
    }

    // B. External Registration Listing
    if (event.listingType === 'external_registration') {
      return (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.btnPressed]}
          onPress={() => handleOpenExternal()}
        >
          <Text style={styles.actionBtnTextPrimary}>Register on Partner Site</Text>
          <ExternalLink size={18} color="#FFFFFF" />
        </Pressable>
      );
    }

    // C. Free Booking Listing
    if (event.listingType === 'free_booking') {
      return (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.btnPressed]}
          onPress={handleBookNow}
        >
          <Text style={styles.actionBtnTextPrimary}>Book Free Experience</Text>
          <Sparkles size={18} color={theme.colors.gold} />
        </Pressable>
      );
    }

    // D. Paid Booking Listing
    if (event.listingType === 'paid_booking') {
      const isPaymentActive = event.paymentConfig?.enabled && event.paymentConfig?.providerStatus === 'active';
      if (!isPaymentActive) {
        return (
          <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
            <Text style={styles.actionBtnTextDisabled}>Paid Experience (Booking Available Soon)</Text>
          </View>
        );
      }
      const priceText = `Book Now • ${event.paymentConfig?.currency || 'INR'} ${event.paymentConfig?.amount || 0}`;
      return (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnPrimary, pressed && styles.btnPressed]}
          onPress={handleBookNow}
        >
          <Text style={styles.actionBtnTextPrimary}>{priceText}</Text>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Explicitly suppress Expo Router default white header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Nirvaha Dark-Mode Navigation Header */}
      <View style={[styles.darkHeader, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable
          style={({ pressed }) => [styles.headerIconBtn, pressed && styles.btnPressed]}
          onPress={handleBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerTitleCenter}>
          <Text style={styles.darkHeaderTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.darkHeaderSubtitle}>
            {CATEGORY_LABELS[event.category] || event.category}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.headerIconBtn, pressed && styles.btnPressed]}
          onPress={handleShare}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Share Experience"
        >
          <Share2 size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Cover Image */}
        <View style={styles.coverWrapper}>
          <Image
            source={{
              uri:
                event.media?.coverImageUrl ||
                'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.coverImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.1)', 'rgba(10,10,10,0.5)', '#0A0A0A']}
            style={styles.coverGradient}
          />

          <View style={styles.badgeRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>
                {CATEGORY_LABELS[event.category] || event.category}
              </Text>
            </View>
            <StatusBadge status={computedStatus} />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          {event.shortDescription ? (
            <Text style={styles.eventShortDesc}>{event.shortDescription}</Text>
          ) : null}

          {/* Schedule Summary Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Calendar size={18} color={theme.colors.gold} style={styles.infoIcon} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formattedDate}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Clock size={18} color={theme.colors.gold} style={styles.infoIcon} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Time & Duration</Text>
                <Text style={styles.infoValue}>
                  {timeRange} {event.schedule?.timezone ? `(${event.schedule.timezone})` : ''}
                </Text>
                {event.schedule?.durationMinutes ? (
                  <Text style={styles.infoSubtext}>
                    {event.schedule.durationMinutes} Minutes Session
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Location Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              {isOnline ? (
                <Video size={18} color={theme.colors.gold} style={styles.infoIcon} />
              ) : (
                <MapPin size={18} color={theme.colors.gold} style={styles.infoIcon} />
              )}
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>{locationLabel}</Text>
                {isOnline ? (
                  <>
                    <Text style={styles.infoValue}>Live Streaming Experience</Text>
                    <Text style={styles.infoSubtext}>
                      {event.location?.accessInstructions ||
                        'Private access link will be provided upon booking confirmation.'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.infoValue}>{event.location?.venueName || 'Sacred Venue'}</Text>
                    {event.location?.address ? (
                      <Text style={styles.infoSubtext}>{event.location.address}</Text>
                    ) : null}
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Capacity Card */}
          {hasLimitedCapacity && (
            <View style={styles.capacityCard}>
              <View style={styles.capacityHeader}>
                <Users size={16} color={theme.colors.gold} />
                <Text style={styles.capacityTitle}>Availability</Text>
                <Text style={styles.capacityCount}>
                  {isFullyBooked ? '0 Spots Left' : `${remainingSpots} of ${capacity} Spots Left`}
                </Text>
              </View>
              <View style={styles.capacityBarBackground}>
                <View
                  style={[
                    styles.capacityBarFill,
                    {
                      width: `${Math.min(100, (currentAttendees / capacity) * 100)}%`,
                      backgroundColor: isFullyBooked ? '#EF4444' : theme.colors.gold,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* About Section */}
          <View style={styles.textSection}>
            <Text style={styles.sectionHeading}>About This Experience</Text>
            <Text style={styles.bodyText}>
              {event.fullDescription || event.shortDescription || 'Immerse in this restorative mindfulness journey.'}
            </Text>
          </View>

          {/* Guide / Organizer */}
          {event.organizer?.name ? (
            <View style={styles.organizerSection}>
              <Text style={styles.sectionHeading}>Your Guide</Text>
              <View style={styles.organizerCard}>
                <Image
                  source={{
                    uri:
                      event.organizer.avatarUrl ||
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                  }}
                  style={styles.organizerAvatar}
                />
                <View style={styles.organizerInfo}>
                  <Text style={styles.organizerName}>{event.organizer.name}</Text>
                  <Text style={styles.organizerBio}>
                    {event.organizer.bio || 'Experienced wellbeing practitioner and guide.'}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {/* Policy Section */}
          {event.bookingConfig?.cancellationPolicy ? (
            <View style={styles.policySection}>
              <View style={styles.policyRow}>
                <Info size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: 6 }} />
                <Text style={styles.policyTitle}>Cancellation & Policy</Text>
              </View>
              <Text style={styles.policyText}>{event.bookingConfig.cancellationPolicy}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
        {renderActionButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  darkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  darkHeaderTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  darkHeaderSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  errorTitle: {
    fontFamily: theme.typography.display,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 21,
  },
  errorActionRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.healingGreen,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    maxWidth: 240,
  },
  retryBtnText: {
    fontFamily: theme.typography.bodyMedium,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backHomeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    maxWidth: 240,
    alignItems: 'center',
  },
  backHomeButtonText: {
    fontFamily: theme.typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverWrapper: {
    width: width,
    height: width * 0.75,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80%',
  },
  badgeRow: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: 'rgba(45, 90, 76, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(163, 189, 177, 0.3)',
  },
  categoryPillText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  eventTitle: {
    fontFamily: theme.typography.display,
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 8,
  },
  eventShortDesc: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#121A15',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.3)',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: theme.colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  infoSubtext: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  capacityCard: {
    backgroundColor: '#141E18',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    marginBottom: 18,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  capacityTitle: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 6,
    flex: 1,
  },
  capacityCount: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  capacityBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  textSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  sectionHeading: {
    fontFamily: theme.typography.display,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  bodyText: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 23,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111813',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  organizerBio: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    lineHeight: 16,
  },
  policySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 10,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  policyTitle: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  policyText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  actionBtn: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnPrimary: {
    backgroundColor: theme.colors.healingGreen,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  actionBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionBtnTextPrimary: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  actionBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionBtnTextDisabled: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
