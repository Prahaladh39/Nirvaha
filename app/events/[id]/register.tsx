import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react-native';
import { EventDocument } from '../../../types/events';
import { AttendeeDetail } from '../../../types/bookings';
import { fetchEventById } from '../../../services/eventsService';
import { createBooking } from '../../../services/bookingsService';
import { useAuth } from '../../../contexts/AuthContext';
import { theme } from '../../../constants/theme';

export default function EventRegisterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profileName } = useAuth();

  const [event, setEvent] = useState<EventDocument | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [participantCount, setParticipantCount] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Prefill user details from auth context
  useEffect(() => {
    if (user) {
      if (profileName) setFullName(profileName);
      else if (user.displayName) setFullName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user, profileName]);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoadingEvent(true);
      const data = await fetchEventById(id);
      setEvent(data);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Could Not Load Event',
        text2: err?.message || 'Please check your connection and try again.',
      });
    } finally {
      setIsLoadingEvent(false);
    }
  }, [id]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const maxParticipants = event?.bookingConfig?.maxParticipantsPerBooking || 4;

  const handleIncrement = () => {
    if (participantCount < maxParticipants) {
      setParticipantCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (participantCount > 1) {
      setParticipantCount((prev) => prev - 1);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address for confirmation.';
    }

    const requiresPhone = event?.bookingConfig?.requiredAttendeeFields?.includes('phone');
    if (requiresPhone && (!phone.trim() || phone.trim().length < 7)) {
      errors.phone = 'Please provide a valid phone contact.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!event) return;
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Required Information Missing',
        text2: 'Please review highlighted fields before confirming.',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const attendeeDetails: AttendeeDetail[] = [
        {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      ];

      // If multiple participants booked, fill additional seat slots
      for (let i = 2; i <= participantCount; i++) {
        attendeeDetails.push({
          fullName: `${fullName.trim()} (Guest ${i})`,
          email: email.trim().toLowerCase(),
        });
      }

      const booking = await createBooking({
        eventId: event.id,
        participantCount,
        attendeeDetails,
        userName: fullName.trim(),
        userEmail: email.trim().toLowerCase(),
        userPhone: phone.trim() || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Reservation Confirmed',
        text2: `Booking reference: ${booking.bookingReference}`,
      });

      // Navigate to celebratory confirmation ticket screen
      router.replace({
        pathname: '/events/[id]/confirmation',
        params: {
          id: event.id,
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          participantCount: String(booking.participantCount),
          eventTitle: event.title,
          eventDate: event.schedule?.startDate || '',
          eventLocation:
            event.location?.type === 'online'
              ? 'Online Session'
              : event.location?.venueName || event.location?.address || 'Sanctuary',
        },
      } as any);
    } catch (err: any) {
      let msg = 'Failed to complete booking. Please try again.';
      if (typeof err === 'string' && err.trim().length > 0 && err !== '[object Object]') {
        msg = err.trim();
      } else if (typeof err?.message === 'string' && err.message.trim().length > 0 && err.message !== '[object Object]') {
        msg = err.message.trim();
      } else if (typeof err?.error === 'string' && err.error.trim().length > 0 && err.error !== '[object Object]') {
        msg = err.error.trim();
      } else if (err?.details && typeof err.details.message === 'string' && err.details.message.trim().length > 0) {
        msg = err.details.message.trim();
      }

      Toast.show({
        type: 'error',
        text1: 'Booking Unsuccessful',
        text2: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <View style={[styles.centeredContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
        <Text style={styles.loadingText}>Preparing booking sanctuary...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.centeredContainer, { paddingTop: insets.top, paddingHorizontal: 30 }]}>
        <AlertCircle size={44} color="#EF4444" style={{ marginBottom: 12 }} />
        <Text style={styles.errorTitle}>Event Not Available</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Return</Text>
        </Pressable>
      </View>
    );
  }

  const startDate = new Date(event.schedule?.startDate);
  const formattedDate = !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'Upcoming';

  const formattedTime = !isNaN(startDate.getTime())
    ? startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  const locationText =
    event.location?.type === 'online'
      ? 'Online Gathering'
      : event.location?.venueName || event.location?.address || 'In-Person';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 44) }]}>
        <Pressable
          style={({ pressed }) => [styles.backIconBtn, pressed && styles.btnPressed]}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <ChevronLeft size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Reserve Your Experience</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Event Snapshot Card */}
        <View style={styles.eventSnapshotCard}>
          <Image
            source={{ uri: event.media?.coverImageUrl || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80' }}
            style={styles.snapshotImage}
          />
          <View style={styles.snapshotDetails}>
            <Text style={styles.snapshotTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.snapshotRow}>
              <Calendar size={13} color={theme.colors.gold} />
              <Text style={styles.snapshotMeta}>
                {formattedDate} {formattedTime ? `• ${formattedTime}` : ''}
              </Text>
            </View>
            <View style={styles.snapshotRow}>
              <MapPin size={13} color="rgba(255,255,255,0.6)" />
              <Text style={styles.snapshotMeta} numberOfLines={1}>
                {locationText}
              </Text>
            </View>
          </View>
        </View>

        {/* Seat / Participant Selector */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Number of Guests</Text>
              <Text style={styles.sectionSubtitle}>
                Max {maxParticipants} {maxParticipants === 1 ? 'attendee' : 'attendees'} per booking
              </Text>
            </View>
            <View style={styles.counterRow}>
              <Pressable
                style={[styles.counterBtn, participantCount <= 1 && styles.counterBtnDisabled]}
                onPress={handleDecrement}
                disabled={participantCount <= 1}
              >
                <Minus size={16} color={participantCount <= 1 ? 'rgba(255,255,255,0.2)' : '#FFFFFF'} />
              </Pressable>
              <Text style={styles.counterValue}>{participantCount}</Text>
              <Pressable
                style={[styles.counterBtn, participantCount >= maxParticipants && styles.counterBtnDisabled]}
                onPress={handleIncrement}
                disabled={participantCount >= maxParticipants}
              >
                <Plus size={16} color={participantCount >= maxParticipants ? 'rgba(255,255,255,0.2)' : '#FFFFFF'} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Primary Attendee Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Attendee Details</Text>
          <Text style={styles.sectionSubtitle}>
            Your reservation confirmation and joining details will be sent here.
          </Text>

          {/* Full Name Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, formErrors.fullName && styles.inputError]}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              autoCapitalize="words"
            />
            {formErrors.fullName ? (
              <Text style={styles.errorText}>{formErrors.fullName}</Text>
            ) : null}
          </View>

          {/* Email Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={[styles.textInput, formErrors.email && styles.inputError]}
              placeholder="your.email@example.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
          </View>

          {/* Phone Number Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
            <TextInput
              style={[styles.textInput, formErrors.phone && styles.inputError]}
              placeholder="+91 98765 43210"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: '' }));
              }}
              keyboardType="phone-pad"
            />
            {formErrors.phone ? <Text style={styles.errorText}>{formErrors.phone}</Text> : null}
          </View>

          {/* Special Requests / Notes Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Special Requests or Dietary Preferences</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Any physical accommodations, seating requests, or meditation experience level..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Free Experience Guarantee Card */}
        <View style={styles.guaranteeCard}>
          <ShieldCheck size={20} color={theme.colors.gold} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Nirvaha Wellbeing Guarantee</Text>
            <Text style={styles.guaranteeText}>
              This experience is offered freely to our community. You may cancel at any time from your bookings passbook to release your seat for fellow seekers.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirmation Action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            isSubmitting && styles.submitBtnDisabled,
            pressed && styles.btnPressed,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>
                Confirm Free Booking ({participantCount} {participantCount === 1 ? 'Seat' : 'Seats'})
              </Text>
              <Sparkles size={18} color={theme.colors.gold} />
            </>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  errorTitle: {
    fontFamily: theme.typography.display,
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 14,
  },
  backButton: {
    backgroundColor: theme.colors.healingGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: theme.typography.bodyMedium,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0A0A0A',
  },
  backIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.display,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 20,
  },
  eventSnapshotCard: {
    flexDirection: 'row',
    backgroundColor: '#131B16',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 76, 0.3)',
    marginBottom: 20,
    alignItems: 'center',
  },
  snapshotImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  snapshotDetails: {
    flex: 1,
  },
  snapshotTitle: {
    fontFamily: theme.typography.display,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  snapshotMeta: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sectionCard: {
    backgroundColor: '#121814',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: theme.typography.display,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.55)',
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 90, 76, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(163, 189, 177, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  counterValue: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0A0F0C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
    paddingTop: 10,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontFamily: theme.typography.body,
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
  guaranteeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  guaranteeTitle: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 13,
    color: theme.colors.gold,
    fontWeight: '600',
    marginBottom: 2,
  },
  guaranteeText: {
    fontFamily: theme.typography.body,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
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
  submitBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.healingGreen,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: theme.colors.healingGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: theme.typography.bodyMedium,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

