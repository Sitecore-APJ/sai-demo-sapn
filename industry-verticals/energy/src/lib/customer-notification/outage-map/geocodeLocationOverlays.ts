import { splitLocationQuery } from '@/lib/customer-notification/outage-map/splitLocationQuery';

export interface LocationOverlayBounds {
  label: string;
  bounds: google.maps.LatLngBoundsLiteral;
  center: google.maps.LatLngLiteral;
}

const DEFAULT_REGION_SUFFIX = 'South Australia, Australia';

function boundsToLiteral(bounds: google.maps.LatLngBounds): google.maps.LatLngBoundsLiteral {
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();

  return {
    north: northEast.lat(),
    east: northEast.lng(),
    south: southWest.lat(),
    west: southWest.lng(),
  };
}

function geocodeSegment(
  geocoder: google.maps.Geocoder,
  segment: string
): Promise<LocationOverlayBounds | null> {
  return new Promise((resolve) => {
    geocoder.geocode({ address: `${segment}, ${DEFAULT_REGION_SUFFIX}` }, (results, status) => {
      if (status !== 'OK' || !results?.[0]?.geometry) {
        resolve(null);
        return;
      }

      const bounds = results[0].geometry.bounds ?? results[0].geometry.viewport;

      if (!bounds) {
        resolve(null);
        return;
      }

      const center = results[0].geometry.location;

      resolve({
        label: segment,
        bounds: boundsToLiteral(bounds),
        center: { lat: center.lat(), lng: center.lng() },
      });
    });
  });
}

/**
 * Geocodes location text into map bounds for impacted-area overlays.
 * @param {typeof google.maps | null} mapsApi - Loaded Google Maps API
 * @param {string | undefined | null} locationQuery - Location field value
 * @returns {Promise<{ overlays: LocationOverlayBounds[]; errors: string[] }>} Overlay bounds and geocoding errors
 */
export async function geocodeLocationOverlays(
  mapsApi: typeof google.maps | null,
  locationQuery: string | undefined | null
): Promise<{ overlays: LocationOverlayBounds[]; errors: string[] }> {
  const segments = splitLocationQuery(locationQuery);

  if (!mapsApi || segments.length === 0) {
    return { overlays: [], errors: [] };
  }

  const geocoder = new mapsApi.Geocoder();
  const results = await Promise.all(segments.map((segment) => geocodeSegment(geocoder, segment)));
  const overlays = results.filter((result): result is LocationOverlayBounds => result !== null);
  const errors: string[] = [];

  if (overlays.length === 0) {
    errors.push('Could not find map boundaries for the location. Check the Location field value.');
  } else if (overlays.length < segments.length) {
    errors.push(
      'Some locations could not be mapped. Verify each suburb name in the Location field.'
    );
  }

  return { overlays, errors };
}
