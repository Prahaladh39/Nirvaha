/**
 * Nirvaha Events Query & Discovery Service
 * Primary source: Team 1 Backend API (GET /api/events, GET /api/events/[id])
 * Fallback / Source of truth: Cloud Firestore client query (where publicationStatus in ['published', 'featured'])
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
import { BookingApiError, NetworkError } from '../types/api';
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

  const canonicalId = String(id || raw?.id || '').trim();

  return {
    id: canonicalId,
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
      externalUrl: raw?.bookingConfig?.externalUrl || raw?.externalUrl || '',
    },
    paymentConfig: {
      enabled: Boolean(raw?.paymentConfig?.enabled),
      currency: raw?.paymentConfig?.currency || 'INR',
      amount: raw?.paymentConfig?.amount || 0,
      providerStatus: raw?.paymentConfig?.providerStatus || 'unconfigured',
      providerName: raw?.paymentConfig?.providerName || '',
    },
    publicationStatus: raw?.publicationStatus || 'published',
    isFeatured: Boolean(raw?.isFeatured || raw?.publicationStatus === 'featured'),
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
    const response = await publicRequest<any>(`/api/events${queryString}`);
    const list = response?.data || response?.events;
    if (Array.isArray(list)) {
      return list.map((evt: any) => normalizeEventDocument(evt.id, evt));
    }
  } catch (apiError: any) {
    // Fall through to Firestore fallback if backend is unreachable or returns non-200
  }

  // 2. Fallback Attempt: Direct Firestore Read for published events
  try {
    const fallbackEvents = await fetchEventsFromFirestore(filters);
    return fallbackEvents;
  } catch (firestoreErr) {
    throw firestoreErr;
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

  const cleanId = eventId.trim();

  // 1. Primary Attempt: Team 1 Backend API
  try {
    const response = await publicRequest<any>(
      `/api/events/${encodeURIComponent(cleanId)}`
    );
    const eventData = response?.data || response?.event;
    if (eventData) {
      return normalizeEventDocument(eventData.id || cleanId, eventData);
    }
  } catch (apiErr: any) {
    // If backend API is down, returns 404/500, or endpoint route is missing,
    // do not short-circuit with null. Continue to authoritative Firestore read.
  }

  // 2. Authoritative Fallback: Direct Firestore Read
  try {
    if (db) {
      const docRef = doc(db, 'events', cleanId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        return normalizeEventDocument(docSnap.id, docData);
      }
      // If docSnap does not exist in Firestore, event is genuinely not found.
      return null;
    }
  } catch (firestoreErr: any) {
    // If Firestore fails due to network/offline conditions, rethrow as NetworkError
    // so the caller can present a retryable network error state.
    const isNetworkError =
      firestoreErr?.message?.toLowerCase().includes('network') ||
      firestoreErr?.message?.toLowerCase().includes('offline') ||
      firestoreErr?.code === 'unavailable';

    if (isNetworkError) {
      throw new NetworkError(
        'Unable to connect to the network. Please check your internet connection.',
        firestoreErr
      );
    }
    throw firestoreErr;
  }

  return null;
}
