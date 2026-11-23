/**
 * Nirvaha Calendar Integration Service
 * Generates standards-compliant iCalendar (.ics) files and Google Calendar links.
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export interface CalendarEventDetails {
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string
  endDate?: string;   // ISO 8601 string
  location?: string;
  bookingReference: string;
}

function formatIcsDateTime(date: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Builds standard RFC 5545 iCalendar (.ics) string.
 */
export function generateIcsContent(details: CalendarEventDetails): string {
  const start = new Date(details.startDate);
  const end = details.endDate ? new Date(details.endDate) : new Date(start.getTime() + 90 * 60 * 1000); // 90 min default
  const now = new Date();

  const cleanTitle = (details.title || 'Nirvaha Sacred Gathering').replace(/\n/g, ' ');
  const cleanDesc = (
    `${details.description || 'Nirvaha Experience'}\n\nPass Reference: ${details.bookingReference}\nPlease arrive 10 minutes prior.`
  )
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

  const cleanLoc = (details.location || 'Nirvaha Sanctuary')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nirvaha App//Gatherings & Retreats//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nirvaha-${details.bookingReference}-${start.getTime()}@nirvaha.app`,
    `DTSTAMP:${formatIcsDateTime(now)}`,
    `DTSTART:${formatIcsDateTime(start)}`,
    `DTEND:${formatIcsDateTime(end)}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanLoc}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your Nirvaha Gathering starts in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates a Google Calendar web intent URL.
 */
export function getGoogleCalendarUrl(details: CalendarEventDetails): string {
  const start = new Date(details.startDate);
  const end = details.endDate ? new Date(details.endDate) : new Date(start.getTime() + 90 * 60 * 1000);

  const startIso = formatIcsDateTime(start);
  const endIso = formatIcsDateTime(end);

  const desc = `${details.description || ''}\n\nReservation Pass: ${details.bookingReference}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.title || 'Nirvaha Sacred Gathering',
    dates: `${startIso}/${endIso}`,
    details: desc,
    location: details.location || 'Nirvaha Sanctuary',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Exports event to native calendar via .ics sharing or Google Calendar fallback.
 */
export async function addEventToCalendar(details: CalendarEventDetails): Promise<{ success: boolean; method: string }> {
  try {
    const icsContent = generateIcsContent(details);
    const filename = `nirvaha_pass_${details.bookingReference}.ics`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, icsContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/calendar',
        dialogTitle: 'Add to Your Calendar',
        UTI: 'com.apple.ical.ics',
      });
      return { success: true, method: 'native_share' };
    }

    // Fallback: Open Google Calendar in browser
    const googleUrl = getGoogleCalendarUrl(details);
    const canOpen = await Linking.canOpenURL(googleUrl);
    if (canOpen) {
      await Linking.openURL(googleUrl);
      return { success: true, method: 'google_web' };
    }

    return { success: false, method: 'unsupported' };
  } catch (error) {
    console.warn('Calendar export error:', error);
    // Graceful fallback to Google Calendar
    try {
      const googleUrl = getGoogleCalendarUrl(details);
      await Linking.openURL(googleUrl);
      return { success: true, method: 'google_web_fallback' };
    } catch {
      return { success: false, method: 'failed' };
    }
  }
}
