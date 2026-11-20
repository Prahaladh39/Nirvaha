/**
 * Types & Interfaces for Nirvaha Events & Experiences
 * 100% compliant with NIRVAHA_EVENTS_BOOKING_CONTRACT.md (v1.0.0)
 */

export type EventCategory =
  | 'yoga'
  | 'meditation'
  | 'sound_healing'
  | 'wellness_workshops'
  | 'retreats'
  | 'community_experiences';

export type EventListingType =
  | 'advertisement'
  | 'external_registration'
  | 'free_booking'
  | 'paid_booking';

export type EventPublicationStatus =
  | 'draft'
  | 'published'
  | 'featured'
  | 'cancelled'
  | 'archived';

export type LocationType = 'online' | 'offline' | 'hybrid';

export type PaymentProviderStatus = 'unconfigured' | 'pending' | 'active';

export interface EventOrganizer {
  name: string;
  contact?: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

export interface EventMedia {
  coverImageUrl: string;
  galleryImageUrls?: string[];
}

export interface EventSchedule {
  startDate: string; // ISO 8601 string
  endDate: string;   // ISO 8601 string
  timezone: string;  // e.g. 'Asia/Kolkata' or 'UTC'
  durationMinutes: number;
  registrationDeadline: string; // ISO 8601 string
}

export interface EventLocation {
  type: LocationType;
  venueName?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  meetingUrl?: string;
  accessInstructions?: string;
}

export interface EventBookingConfig {
  capacity: number;
  maxParticipantsPerBooking: number;
  registrationOpenDate: string;  // ISO 8601 string
  registrationCloseDate: string; // ISO 8601 string
  requiredAttendeeFields: Array<'fullName' | 'email' | 'phone' | 'notes'>;
  cancellationPolicy?: string;
  externalUrl?: string;
}

export interface EventPaymentConfig {
  enabled: boolean;
  currency?: string;
  amount?: number;
  providerStatus: PaymentProviderStatus;
  providerName?: string;
}

export interface EventDocument {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: EventCategory;
  tags?: string[];
  organizer: EventOrganizer;
  media: EventMedia;
  schedule: EventSchedule;
  location: EventLocation;
  listingType: EventListingType;
  bookingConfig: EventBookingConfig;
  paymentConfig: EventPaymentConfig;
  publicationStatus: EventPublicationStatus;
  isFeatured?: boolean;
  displayOrder: number;
  notifyOnPublish: boolean;
  notificationSent?: boolean;
  attendeeCount: number;
  confirmedBookingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilterParams {
  category?: EventCategory | string;
  search?: string;
  featured?: boolean;
  status?: EventPublicationStatus | string;
  limit?: number;
}

export interface EventsApiResponse {
  success: boolean;
  events: EventDocument[];
  total: number;
  message?: string;
}

export interface EventDetailApiResponse {
  success: boolean;
  event: EventDocument;
  message?: string;
}

export type ComputedEventStatus =
  | 'published'
  | 'featured'
  | 'cancelled'
  | 'archived'
  | 'fully_booked'
  | 'registration_closed'
  | 'unavailable';

/**
 * Determines the effective UI presentation status of an event
 * based on lifecycle status, capacity, and deadlines.
 */
export function getComputedEventStatus(event: EventDocument): ComputedEventStatus {
  if (event.publicationStatus === 'cancelled') {
    return 'cancelled';
  }
  if (event.publicationStatus === 'archived') {
    return 'archived';
  }

  const now = Date.now();
  if (event.schedule?.registrationDeadline) {
    const deadlineTime = new Date(event.schedule.registrationDeadline).getTime();
    if (!isNaN(deadlineTime) && now > deadlineTime) {
      return 'registration_closed';
    }
  }
  if (event.bookingConfig?.registrationCloseDate) {
    const closeTime = new Date(event.bookingConfig.registrationCloseDate).getTime();
    if (!isNaN(closeTime) && now > closeTime) {
      return 'registration_closed';
    }
  }

  if (
    event.bookingConfig?.capacity > 0 &&
    event.attendeeCount >= event.bookingConfig.capacity
  ) {
    return 'fully_booked';
  }

  if (event.isFeatured || event.publicationStatus === 'featured') {
    return 'featured';
  }

  return 'published';
}

/**
 * Validates whether an event is currently open for booking.
 */
export function isEventBookable(event: EventDocument): boolean {
  if (event.listingType !== 'free_booking') {
    return false;
  }
  const status = getComputedEventStatus(event);
  return status === 'published' || status === 'featured';
}
