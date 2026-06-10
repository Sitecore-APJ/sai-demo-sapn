/**
 * Splits a location field into suburb-style segments for geocoding overlays.
 * @param {string | undefined | null} location - Raw location text from Sitecore
 * @returns {string[]} Individual location segments
 */
export function splitLocationQuery(location: string | undefined | null): string[] {
  if (!location?.trim()) {
    return [];
  }

  return location
    .split(/\s+and\s+|,/i)
    .map((part) => part.trim())
    .filter(Boolean);
}
