import {
  OutageMapData,
  OutagePin,
  OutageStatus,
  ParseOutageMapResult,
} from '@/types/customer-notification';

const DEFAULT_CENTER = { lat: -34.9285, lng: 138.6007 };
const DEFAULT_ZOOM = 11;

const STATUS_VALUES: OutageStatus[] = ['active', 'planned', 'restored'];

function normalizeStatus(value: string): OutageStatus | null {
  const normalized = value.trim().toLowerCase() as OutageStatus;
  return STATUS_VALUES.includes(normalized) ? normalized : null;
}

function parseCenterLine(
  line: string
): { center: { lat: number; lng: number }; zoom: number } | null {
  const match = line.match(
    /^center:\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*zoom:\s*(\d+))?/i
  );

  if (!match) {
    return null;
  }

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  const zoom = match[3] ? parseInt(match[3], 10) : DEFAULT_ZOOM;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { center: { lat, lng }, zoom };
}

function parsePinLine(
  line: string,
  lineNumber: number
): { pin: OutagePin | null; error: string | null } {
  const parts = line.split('|').map((part) => part.trim());

  if (parts.length < 5) {
    return {
      pin: null,
      error: `Line ${lineNumber}: expected "title | lat, lng | status | date | description"`,
    };
  }

  const [title, coordinates, statusPart, date, ...descriptionParts] = parts;
  const location = descriptionParts.join(' | ') || title;
  const status = normalizeStatus(statusPart);

  if (!status) {
    return {
      pin: null,
      error: `Line ${lineNumber}: invalid status "${statusPart}" (use active, planned, or restored)`,
    };
  }

  const coordMatch = coordinates.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

  if (!coordMatch) {
    return {
      pin: null,
      error: `Line ${lineNumber}: invalid coordinates "${coordinates}"`,
    };
  }

  const lat = parseFloat(coordMatch[1]);
  const lng = parseFloat(coordMatch[2]);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return {
      pin: null,
      error: `Line ${lineNumber}: coordinates must be numeric`,
    };
  }

  return {
    pin: {
      id: `outage-${lineNumber}`,
      title,
      location,
      status,
      date,
      lat,
      lng,
    },
    error: null,
  };
}

/**
 * Parses the human-readable Outage Map multiline text field into map center, zoom, and pins.
 * @param {string | undefined | null} rawValue - Raw OutageMap field value from Sitecore
 * @returns {ParseOutageMapResult} Parsed map data and any line-level validation errors
 */
export function parseOutageMapField(rawValue: string | undefined | null): ParseOutageMapResult {
  const errors: string[] = [];

  if (!rawValue?.trim()) {
    return { data: null, errors: [] };
  }

  const lines = rawValue
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  let center = DEFAULT_CENTER;
  let zoom = DEFAULT_ZOOM;
  const outages: OutagePin[] = [];
  let lineOffset = 0;

  if (lines[0]?.toLowerCase().startsWith('center:')) {
    const parsedCenter = parseCenterLine(lines[0]);

    if (parsedCenter) {
      center = parsedCenter.center;
      zoom = parsedCenter.zoom;
      lineOffset = 1;
    } else {
      errors.push('Could not parse map center line');
    }
  }

  lines.slice(lineOffset).forEach((line, index) => {
    const lineNumber = lineOffset + index + 1;
    const { pin, error } = parsePinLine(line, lineNumber);

    if (error) {
      errors.push(error);
    } else if (pin) {
      outages.push(pin);
    }
  });

  if (outages.length === 0 && errors.length === 0) {
    return { data: null, errors: [] };
  }

  if (outages.length > 0 && !lines[0]?.toLowerCase().startsWith('center:')) {
    center = { lat: outages[0].lat, lng: outages[0].lng };
  }

  const data: OutageMapData = { center, zoom, outages };

  return { data: outages.length > 0 ? data : null, errors };
}
