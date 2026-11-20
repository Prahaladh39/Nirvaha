/**
 * Types & Interfaces for Nirvaha Bookings
 * 100% compliant with NIRVAHA_EVENTS_BOOKING_CONTRACT.md (v1.0.0)
 */

import { LocationType } from './events';
import { BookingApiError } from './api';

export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlist' | 'attended';

export type PaymentStatus = 'none' | 'pending' | 'paid' | 'refunded';

export interface AttendeeDetail {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface BookingDocument {
  id: string;
  bookingReference: string; // Format: NIR-EVT-YYYY-XXXXXX
  eventId: string;
  eventTitle: string;
  eventStartDate: string;
  eventLocation: {
    type: LocationType;
    venueName?: string;
    meetingUrl?: string;
  };
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  participantCount: number;
  attendeeDetails: AttendeeDetail[];
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  joiningInstructions?: string;
  bookedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  eventId: string;
  participantCount: number;
  attendeeDetails: AttendeeDetail[];
}

export interface BookingApiResponse {
  success: boolean;
  booking: BookingDocument;
  message?: string;
}

export interface BookingsListApiResponse {
  success: boolean;
  bookings: BookingDocument[];
  total: number;
  message?: string;
}

export interface CancelBookingPayload {
  reason?: string;
}

export { BookingApiError };
