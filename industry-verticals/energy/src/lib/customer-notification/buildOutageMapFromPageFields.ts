import { getRichTextPlainText } from '@/lib/customer-notification/richTextFieldUtils';
import {
  CustomerNotificationPageFields,
  OutageMapData,
  OutagePin,
  ParseOutageMapResult,
} from '@/types/customer-notification';

const DEFAULT_ZOOM = 14;

function parseCoordinates(
  rawValue: string | undefined
): { lat: number; lng: number } | { error: string } | null {
  if (!rawValue?.trim()) {
    return null;
  }

  const match = rawValue.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

  if (!match) {
    return { error: 'Invalid coordinates. Use "latitude, longitude" (e.g. -34.9285, 138.6007).' };
  }

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return { error: 'Coordinates must be numeric values.' };
  }

  return { lat, lng };
}

/**
 * Builds outage map data from page-level customer notification fields.
 * @param {CustomerNotificationPageFields | undefined} fields - Page fields from layout or rendering props
 * @returns {ParseOutageMapResult} Map center, zoom, single pin, and validation errors
 */
export function buildOutageMapFromPageFields(
  fields: CustomerNotificationPageFields | undefined
): ParseOutageMapResult {
  const parsed = parseCoordinates(fields?.OutageLocationPinOnMap?.value);

  if (!parsed) {
    return { data: null, errors: [] };
  }

  if ('error' in parsed) {
    return { data: null, errors: [parsed.error] };
  }

  const title = fields?.OutageLocation?.value?.trim() || 'Outage location';
  const summary = fields?.OutageSummary?.value?.trim();
  const description = getRichTextPlainText(fields?.OutageDescription);
  const location = summary || description || title;

  const pin: OutagePin = {
    id: 'outage-page',
    title,
    location,
    status: 'active',
    date: fields?.OutageDate?.value ?? '',
    lat: parsed.lat,
    lng: parsed.lng,
  };

  const data: OutageMapData = {
    center: { lat: parsed.lat, lng: parsed.lng },
    zoom: DEFAULT_ZOOM,
    outages: [pin],
  };

  return { data, errors: [] };
}
