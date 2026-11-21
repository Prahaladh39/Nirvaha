/**
 * Nirvaha Bookings Service
 * 
 * STRICT ARCHITECTURAL CONSTRAINTS:
 * 1. Strictly NO direct Cloud Firestore writes from mobile client.
 * 2. All booking mutations (create, cancel) and queries MUST flow through
 *    Team 1 Authenticated Endpoints:
 *      - POST /api/bookings
 *      - GET  /api/bookings
 *      - GET  /api/bookings/[id]
 *      - POST /api/bookings/[id]/cancel
 * 3. All requests must carry Firebase ID Token: Authorization: Bearer <id_token>
 */

import { auth } from '../config/firebase';
import {
  BookingDocument,
  CreateBookingPayload,
  BookingApiResponse,
  BookingsListApiResponse,
} from '../types/bookings';
import { BookingApiError, UnauthenticatedError } from '../types/api';
import { authenticatedRequest } from './apiClient';

/**
 * Submits a new booking to Team 1's authenticated backend.
 * Never writes directly to Cloud Firestore.
 */
export async function createBooking(payload: CreateBookingPayload): Promise<BookingDocument> {
  if (!payload.eventId || !payload.eventId.trim()) {
    throw new BookingApiError(400, 'VALIDATION_ERROR', 'Event ID is required to create a booking.');
  }
  if (!payload.participantCount || payload.participantCount < 1) {
    throw new BookingApiError(400, 'VALIDATION_ERROR', 'Participant count must be at least 1.');
  }
  if (!Array.isArray(payload.attendeeDetails) || payload.attendeeDetails.length === 0) {
    throw new BookingApiError(400, 'VALIDATION_ERROR', 'At least one attendee is required.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new UnauthenticatedError('User must be signed in to book experiences.');
  }

  const response = await authenticatedRequest<BookingApiResponse>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const booking = response?.booking || response?.data;
  if (!booking) {
    throw new BookingApiError(500, 'SERVER_ERROR', 'Booking confirmation was not returned by server.');
  }

  return booking;
}

/**
 * Fetches the authenticated user's own bookings.
 */
export async function fetchMyBookings(): Promise<BookingDocument[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new UnauthenticatedError('User must be signed in to view bookings.');
  }

  const response = await authenticatedRequest<BookingsListApiResponse>(
    `/api/bookings?userId=${encodeURIComponent(user.uid)}`
  );

  return response?.bookings || response?.data || [];
}

/**
 * Fetches a single booking by ID, enforcing user ownership on server.
 */
export async function fetchBookingById(bookingId: string): Promise<BookingDocument> {
  if (!bookingId || !bookingId.trim()) {
    throw new BookingApiError(400, 'VALIDATION_ERROR', 'Booking ID is required.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new UnauthenticatedError('User must be signed in to view booking details.');
  }

  const response = await authenticatedRequest<BookingApiResponse>(
    `/api/bookings/${encodeURIComponent(bookingId.trim())}`
  );

  const booking = response?.booking || response?.data;
  if (!booking) {
    throw new BookingApiError(404, 'NOT_FOUND', 'Booking details could not be found.');
  }

  return booking;
}

/**
 * Cancels a booking via server endpoint with atomic attendee decrement.
 */
export async function cancelBooking(bookingId: string, reason?: string): Promise<BookingDocument> {
  if (!bookingId || !bookingId.trim()) {
    throw new BookingApiError(400, 'VALIDATION_ERROR', 'Booking ID is required.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new UnauthenticatedError('User must be signed in to cancel a booking.');
  }

  const response = await authenticatedRequest<BookingApiResponse>(
    `/api/bookings/${encodeURIComponent(bookingId.trim())}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify({ reason: reason?.trim() || 'Cancelled by user' }),
    }
  );

  const booking = response?.booking || response?.data;
  if (!booking) {
    throw new BookingApiError(500, 'SERVER_ERROR', 'Cancellation confirmation was not returned by server.');
  }

  return booking;
}
