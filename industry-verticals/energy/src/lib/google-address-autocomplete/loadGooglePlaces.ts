import { Loader } from '@googlemaps/js-api-loader';

let loadPromise: Promise<typeof google.maps.places> | null = null;

/**
 * Loads the Google Places library once for address autocomplete overlays.
 */
export function loadGooglePlaces(): Promise<typeof google.maps.places> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Places can only load in the browser.'));
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured.'));
  }

  if (loadPromise) {
    return loadPromise;
  }

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
  });

  loadPromise = loader.importLibrary('places').then(() => google.maps.places);

  return loadPromise;
}

/**
 * ISO 3166-1 alpha-2 country code for Places componentRestrictions.
 * Defaults to Australia (`au`). Set to `none` to disable restriction.
 */
export function getPlacesCountryRestriction(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_PLACES_COUNTRY?.trim().toLowerCase();

  if (raw === 'none') {
    return null;
  }

  return raw || 'au';
}
