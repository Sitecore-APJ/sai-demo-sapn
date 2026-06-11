import { splitLocationQuery } from '@/lib/customer-notification/outage-map/splitLocationQuery';

export interface LocationOverlay {
  label: string;
  polygonGroups: google.maps.LatLngLiteral[][][];
  bounds: google.maps.LatLngBoundsLiteral;
  center: google.maps.LatLngLiteral;
  usesBoundaryPolygon: boolean;
}

const DEFAULT_REGION_SUFFIX = 'South Australia, Australia';

interface BoundaryApiResponse {
  label: string;
  polygonGroups: google.maps.LatLngLiteral[][][];
  bounds: google.maps.LatLngBoundsLiteral;
  center: google.maps.LatLngLiteral;
}

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

function rectangleToPolygonGroup(
  bounds: google.maps.LatLngBoundsLiteral
): google.maps.LatLngLiteral[][][] {
  return [
    [
      [
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.south, lng: bounds.east },
        { lat: bounds.north, lng: bounds.east },
        { lat: bounds.north, lng: bounds.west },
      ],
    ],
  ];
}

async function fetchSuburbBoundary(segment: string): Promise<LocationOverlay | null> {
  const response = await fetch(`/api/outage-map/boundary?location=${encodeURIComponent(segment)}`);

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as BoundaryApiResponse;

  if (!payload.polygonGroups?.length) {
    return null;
  }

  return {
    label: segment,
    polygonGroups: payload.polygonGroups,
    bounds: payload.bounds,
    center: payload.center,
    usesBoundaryPolygon: true,
  };
}

function geocodeSegmentFallback(
  geocoder: google.maps.Geocoder,
  segment: string
): Promise<LocationOverlay | null> {
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

      const boundsLiteral = boundsToLiteral(bounds);
      const center = results[0].geometry.location;

      resolve({
        label: segment,
        polygonGroups: rectangleToPolygonGroup(boundsLiteral),
        bounds: boundsLiteral,
        center: { lat: center.lat(), lng: center.lng() },
        usesBoundaryPolygon: false,
      });
    });
  });
}

async function resolveSegmentOverlay(
  geocoder: google.maps.Geocoder,
  segment: string
): Promise<LocationOverlay | null> {
  const boundaryOverlay = await fetchSuburbBoundary(segment).catch(() => null);

  if (boundaryOverlay) {
    return boundaryOverlay;
  }

  return geocodeSegmentFallback(geocoder, segment);
}

/**
 * Resolves location text into suburb boundary polygons (with rectangular fallback).
 */
export async function geocodeLocationOverlays(
  mapsApi: typeof google.maps | null,
  locationQuery: string | undefined | null
): Promise<{ overlays: LocationOverlay[]; errors: string[] }> {
  const segments = splitLocationQuery(locationQuery);

  if (!mapsApi || segments.length === 0) {
    return { overlays: [], errors: [] };
  }

  const geocoder = new mapsApi.Geocoder();
  const results = await Promise.all(
    segments.map((segment) => resolveSegmentOverlay(geocoder, segment))
  );
  const overlays = results.filter((result): result is LocationOverlay => result !== null);
  const errors: string[] = [];

  if (overlays.length === 0) {
    errors.push('Could not find map boundaries for the location. Check the Location field value.');
  } else if (overlays.length < segments.length) {
    errors.push(
      'Some locations could not be mapped. Verify each suburb name in the Location field.'
    );
  } else if (overlays.some((overlay) => !overlay.usesBoundaryPolygon)) {
    errors.push(
      'Some locations used an approximate area because an exact suburb boundary was unavailable.'
    );
  }

  return { overlays, errors };
}
