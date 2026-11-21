import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Copy,
  ChevronRight,
  Home,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react-native';
import { theme } from '../../../constants/theme';

const { width } = Dimensions.get('window');

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    bookingId?: string;
    bookingReference?: string;
    participantCount?: string;
    eventTitle?: string;
    eventDate?: string;
    eventLocation?: string;
  }>();

  const bookingRef = params.bookingReference || 'NIR-EVT-CONFIRMED';
  const eventTitle = params.eventTitle || 'Sacred Experience';
  const participantCount = params.participantCount || '1';
  const eventLocation = params.eventLocation || 'Nirvaha Sanctuary';

  // Format date
  const rawDate = params.eventDate ? new Date(params.eventDate) : null;
  const formattedDate =
    rawDate && !isNaN(rawDate.getTime())
      ? rawDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Date confirmed with organizer';

  const formattedTime =
    rawDate && !isNaN(rawDate.getTime())
      ? rawDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      : '';

  const handleCopyReference = async () => {
    try {
      await Clipboard.setStringAsync(bookingRef);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Reference Code Copied',
        text2: `${bookingRef} copied to clipboard`,
        visibilityTime: 2500,
      });
    } catch {
      Toast.show({
        type: 'info',
        text1: 'Booking Reference',
        text2: bookingRef,
      });
    }
  };

  const handleGoToMyBookings = () => {
    router.replace('/events/my-bookings' as any);
  };

  const handleGoHome = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 24, 52),
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebratory Icon & Header */}
        <View style={styles.celebrationSection}>
          <View style={styles.iconHaloOuter}>
            <View style={styles.iconHaloInner}>
              <CheckCircle2 size={46} color={theme.colors.gold} />
            </View>
          </View>

          <View style={styles.badgeRow}>
            <Sparkles size={14} color={theme.colors.gold} />
            <Text style={styles.badgeText}>RESERVATION CONFIRMED</Text>
            <Sparkles size={14} color={theme.colors.gold} />
          </View>

          <Text style={styles.celebrationTitle}>Your Seat is Reserved</Text>
          <Text style={styles.celebrationSubtitle}>
            A sacred space has been prepared for you. We look forward to sharing this transformative journey.
          </Text>
        </View>

        {/* Sacred Voucher / Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Header of Ticket */}
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketEventCategory}>NIRVAHA EXPERIENCE PASS</Text>
            <Text style={styles.ticketEventTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
          </View>

          {/* Reference Number Box */}
          <View style={styles.referenceContainer}>
            <Text style={styles.referenceLabel}>BOOKING REFERENCE</Text>
            <Pressable
              style={({ pressed }) => [styles.referenceBox, pressed && styles.pressed]}
              onPress={handleCopyReference}
              accessibilityRole="button"
              accessibilityLabel="Copy booking reference code"
            >
              <Text style={styles.referenceCode}>{bookingRef}</Text>
              <View style={styles.copyBadge}>
                <Copy size={13} color={theme.colors.gold} />
                <Text style={styles.copyBadgeText}>TAP TO COPY</Text>
              </View>
            </Pressable>
          </View>

          {/* Dashed Separator Line with Notches */}
          <View style={styles.notchContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* Ticket Details Body */}
          <View style={styles.ticketBody}>
            {/* Date & Time */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Calendar size={16} color={theme.colors.gold} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>DATE & TIME</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
                {formattedTime ? (
                  <Text style={styles.detailSubvalue}>{formattedTime}</Text>
                ) : null}
              </View>
            </View>

            {/* Location */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <MapPin size={16} color={theme.colors.gold} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>LOCATION / ACCESS</Text>
                <Text style={styles.detailValue} numberOfLines={2}>
                  {eventLocation}
                </Text>
              </View>
            </View>

            {/* Guests */}
            <View style={styles.detailRow}>
              <View style={styles.iconCircle}>
                <Users size={16} color={theme.colors.gold} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>REGISTERED GUESTS</Text>
                <Text style={styles.detailValue}>
                  {participantCount} {Number(participantCount) === 1 ? 'Guest' : 'Guests'}
                </Text>
              </View>
            </View>
          </View>

          {/* Ticket Footer Note */}
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketFooterText}>
              Please present this reference pass or arrive 10 minutes prior to session commencement.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.pressed]}
            onPress={handleGoToMyBookings}
          >
            <BookmarkCheck size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>View in My Bookings</Text>
            <ChevronRight size={18} color="#FFFFFF" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryActionBtn, pressed && styles.pressed]}
            onPress={handleGoHome}
          >
            <Home size={18} color={theme.colors.gold} />
            <Text style={styles.secondaryActionText}>Return to Home Feed</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  celebrationSection: {
    alignItems: 'center',
    marginBottom: 26,
    width: '100%',
  },
  iconHaloOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  iconHaloInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(45, 90, 76, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 11,
    color: theme.colors.gold,
    letterSpacing: 1,
    fontWeight: '700',
  },
  celebrationTitle: {
    fontFamily: theme.typography.display,
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  celebrationSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: '#121A15',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.45)',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 26,
  },
  ticketHeader: {
    padding: 20,
    backgroundColor: '#16221B',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  ticketEventCategory: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: theme.colors.gold,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  ticketEventTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  referenceContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F1612',
  },
  referenceLabel: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  referenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  referenceCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  copyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyBadgeText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 9,
    color: theme.colors.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  notchContainer: {
    height: 20,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#121A15',
  },
  notchLeft: {
    position: 'absolute',
    left: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.45)',
  },
  notchRight: {
    position: 'absolute',
    right: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.45)',
  },
  dashedLine: {
    height: 1,
    marginHorizontal: 22,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  ticketBody: {
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(45, 90, 76, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(163, 189, 177, 0.25)',
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  detailSubvalue: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  ticketFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0E1511',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  ticketFooterText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 16,
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryActionBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.healingGreen,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryActionText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryActionBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
    color: theme.colors.gold,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

