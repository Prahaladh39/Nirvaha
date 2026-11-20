/**
 * Nirvaha Events Query & Discovery Service
 * Primary source: Team 1 Backend API (GET /api/events, GET /api/events/[id])
 * Fallback: Cloud Firestore client query (where publicationStatus in ['published', 'featured'])
 */

import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  EventDocument,
  EventFilterParams,
  EventsApiResponse,
  EventDetailApiResponse,
} from '../types/events';
import { BookingApiError } from '../types/api';
import { publicRequest } from './apiClient';

/**
 * Normalizes raw event objects from either the HTTP API or Firestore documents
 * into a strictly typed EventDocument with ISO-8601 date strings.
 */
export function normalizeEventDocument(id: string, raw: any): EventDocument {
  const toIsoString = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (typeof val?.toDate === 'function') return val.toDate().toISOString();
    if (typeof val?.seconds === 'number') return new Date(val.seconds * 1000).toISOString();
    return new Date(val).toISOString();
  };

  return {
    id: id || raw?.id || '',
    title: raw?.title || '',
    shortDescription: raw?.shortDescription || '',
    fullDescription: raw?.fullDescription || '',
    category: raw?.category || 'community_experiences',
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    organizer: {
      name: raw?.organizer?.name || 'Nirvaha Guide',
      contact: raw?.organizer?.contact || '',
      email: raw?.organizer?.email || '',
      bio: raw?.organizer?.bio || '',
      avatarUrl: raw?.organizer?.avatarUrl || '',
    },
    media: {
      coverImageUrl: raw?.media?.coverImageUrl || '',
      galleryImageUrls: Array.isArray(raw?.media?.galleryImageUrls) ? raw.media.galleryImageUrls : [],
    },
    schedule: {
      startDate: toIsoString(raw?.schedule?.startDate),
      endDate: toIsoString(raw?.schedule?.endDate),
      timezone: raw?.schedule?.timezone || 'Asia/Kolkata',
      durationMinutes: Number(raw?.schedule?.durationMinutes || 60),
      registrationDeadline: toIsoString(raw?.schedule?.registrationDeadline),
    },
    location: {
      type: raw?.location?.type || 'offline',
      venueName: raw?.location?.venueName || '',
      address: raw?.location?.address || '',
      coordinates: raw?.location?.coordinates,
      meetingUrl: raw?.location?.meetingUrl || '',
      accessInstructions: raw?.location?.accessInstructions || '',
    },
    listingType: raw?.listingType || 'free_booking',
    bookingConfig: {
      capacity: Number(raw?.bookingConfig?.capacity || 0),
      maxParticipantsPerBooking: Number(raw?.bookingConfig?.maxParticipantsPerBooking || 1),
      registrationOpenDate: toIsoString(raw?.bookingConfig?.registrationOpenDate),
      registrationCloseDate: toIsoString(raw?.bookingConfig?.registrationCloseDate),
      requiredAttendeeFields: Array.isArray(raw?.bookingConfig?.requiredAttendeeFields)
        ? raw.bookingConfig.requiredAttendeeFields
        : ['fullName', 'email'],
      cancellationPolicy: raw?.bookingConfig?.cancellationPolicy || '',
      externalUrl: raw?.bookingConfig?.externalUrl || '',
    },
    paymentConfig: {
      enabled: Boolean(raw?.paymentConfig?.enabled),
      currency: raw?.paymentConfig?.currency || 'INR',
      amount: raw?.paymentConfig?.amount || 0,
      providerStatus: raw?.paymentConfig?.providerStatus || 'unconfigured',
      providerName: raw?.paymentConfig?.providerName || '',
    },
    publicationStatus: raw?.publicationStatus || 'published',
    isFeatured: Boolean(raw?.isFeatured),
    displayOrder: Number(raw?.displayOrder || 0),
    notifyOnPublish: Boolean(raw?.notifyOnPublish),
    notificationSent: Boolean(raw?.notificationSent),
    attendeeCount: Number(raw?.attendeeCount || 0),
    confirmedBookingsCount: Number(raw?.confirmedBookingsCount || 0),
    createdAt: toIsoString(raw?.createdAt),
    updatedAt: toIsoString(raw?.updatedAt),
  };
}

/**
 * Fetches events directly from Firestore (read-only fallback).
 */
async function fetchEventsFromFirestore(filters?: EventFilterParams): Promise<EventDocument[]> {
  if (!db) return [];
  const eventsCol = collection(db, 'events');
  const q = query(
    eventsCol,
    where('publicationStatus', 'in', ['published', 'featured'])
  );

  const snapshot = await getDocs(q);
  let events: EventDocument[] = [];

  snapshot.forEach((docSnap) => {
    const docData = docSnap.data();
    events.push(normalizeEventDocument(docSnap.id, docData));
  });

  if (filters?.category && filters.category !== 'all') {
    events = events.filter((e) => e.category === filters.category);
  }
  if (filters?.featured) {
    events = events.filter((e) => e.isFeatured === true || e.publicationStatus === 'featured');
  }
  if (filters?.search && filters.search.trim()) {
    const term = filters.search.trim().toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.shortDescription.toLowerCase().includes(term) ||
        e.organizer.name.toLowerCase().includes(term)
    );
  }

  events.sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(a.schedule.startDate).getTime() - new Date(b.schedule.startDate).getTime();
  });

  if (filters?.limit && filters.limit > 0) {
    events = events.slice(0, filters.limit);
  }

  return events;
}

/**
 * Fetches published events matching optional search and category filters.
 * Primary: GET /api/events
 * Fallback: Firestore client query
 */
export async function fetchEvents(filters?: EventFilterParams): Promise<EventDocument[]> {
  const queryParts: string[] = ['status=published'];

  if (filters?.category && filters.category !== 'all') {
    queryParts.push(`category=${encodeURIComponent(filters.category)}`);
  }
  if (filters?.search && filters.search.trim().length > 0) {
    queryParts.push(`search=${encodeURIComponent(filters.search.trim())}`);
  }
  if (filters?.featured !== undefined) {
    queryParts.push(`featured=${filters.featured ? 'true' : 'false'}`);
  }
  if (filters?.limit) {
    queryParts.push(`limit=${filters.limit}`);
  }

  const queryString = `?${queryParts.join('&')}`;

  // 1. Primary Attempt: Team 1 Backend API
  try {
    const response = await publicRequest<EventsApiResponse>(`/api/events${queryString}`);
    if (response?.success && Array.isArray(response.events)) {
      return response.events.map((evt) => normalizeEventDocument(evt.id, evt));
    }
    if (Array.isArray(response?.events)) {
      return response.events.map((evt) => normalizeEventDocument(evt.id, evt));
    }
    return [];
  } catch (apiError: any) {
    // 2. Fallback Attempt: Direct Firestore Read for published events
    try {
      const fallbackEvents = await fetchEventsFromFirestore(filters);
      return fallbackEvents;
    } catch {
      throw apiError;
    }
  }
}

/**
 * Fetches featured events for home rails or discovery carousels.
 */
export async function fetchFeaturedEvents(limitCount = 5): Promise<EventDocument[]> {
  const events = await fetchEvents({ featured: true, limit: limitCount });
  return events.slice(0, limitCount);
}

/**
 * Fetches a single event document by ID.
 * Primary: GET /api/events/[id]
 * Fallback: Firestore doc(db, 'events', eventId)
 */
export async function fetchEventById(eventId: string): Promise<EventDocument | null> {
  if (!eventId || !eventId.trim()) {
    return null;
  }

  // 1. Primary Attempt: Team 1 Backend API
  try {
    const response = await publicRequest<EventDetailApiResponse>(
      `/api/events/${encodeURIComponent(eventId.trim())}`
    );
    if (response?.event) {
      return normalizeEventDocument(response.event.id, response.event);
    }
    return null;
  } catch (err: any) {
    if (err instanceof BookingApiError && err.status === 404) {
      return null;
    }
    if (err?.status === 404) {
      return null;
    }

    // 2. Fallback Attempt: Direct Firestore Read
    try {
      if (db) {
        const docRef = doc(db, 'events', eventId.trim());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return normalizeEventDocument(docSnap.id, docSnap.data());
        }
        return null;
      }
    } catch {
      // Fallback failed, throw original error
    }
    throw err;
  }
}
