export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface LatLngBoundsLiteral {
  north: number;
  south: number;
  east: number;
  west: number;
}

type GeoJsonPosition = [number, number];

type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: GeoJsonPosition[][];
};

type GeoJsonMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: GeoJsonPosition[][][];
};

export type GeoJsonBoundary = GeoJsonPolygon | GeoJsonMultiPolygon;

function ringToPath(ring: GeoJsonPosition[]): LatLngLiteral[] {
  return ring.map(([lng, lat]) => ({ lat, lng }));
}

/**
 * Converts GeoJSON polygon geometry into Google Maps polygon path groups.
 * Each group uses paths[0] as the outer ring and any further rings as holes.
 */
export function geoJsonToPolygonPathGroups(geometry: GeoJsonBoundary): LatLngLiteral[][][] {
  if (geometry.type === 'Polygon') {
    const paths = geometry.coordinates.map(ringToPath).filter((ring) => ring.length >= 3);

    return paths.length > 0 ? [paths] : [];
  }

  return geometry.coordinates
    .map((polygon) => polygon.map(ringToPath).filter((ring) => ring.length >= 3))
    .filter((paths) => paths.length > 0);
}

/**
 * Computes a lat/lng bounds literal that contains all polygon paths.
 */
export function boundsFromPolygonPathGroups(
  polygonGroups: LatLngLiteral[][][]
): LatLngBoundsLiteral | null {
  let north = Number.NEGATIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let west = Number.POSITIVE_INFINITY;

  polygonGroups.forEach((paths) => {
    paths.forEach((ring) => {
      ring.forEach(({ lat, lng }) => {
        north = Math.max(north, lat);
        south = Math.min(south, lat);
        east = Math.max(east, lng);
        west = Math.min(west, lng);
      });
    });
  });

  if (!Number.isFinite(north)) {
    return null;
  }

  return { north, south, east, west };
}

/**
 * Returns the centroid of the first outer ring for map pin placement.
 */
export function centerFromPolygonPathGroups(
  polygonGroups: LatLngLiteral[][][]
): LatLngLiteral | null {
  const outerRing = polygonGroups[0]?.[0];

  if (!outerRing?.length) {
    return null;
  }

  const totals = outerRing.reduce(
    (acc, point) => ({
      lat: acc.lat + point.lat,
      lng: acc.lng + point.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: totals.lat / outerRing.length,
    lng: totals.lng / outerRing.length,
  };
}
