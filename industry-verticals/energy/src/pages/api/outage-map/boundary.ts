import type { NextApiRequest, NextApiResponse } from 'next';
import {
  boundsFromPolygonPathGroups,
  centerFromPolygonPathGroups,
  geoJsonToPolygonPathGroups,
  GeoJsonBoundary,
  LatLngBoundsLiteral,
  LatLngLiteral,
} from '@/lib/customer-notification/outage-map/parseGeoJsonBoundary';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const DEFAULT_REGION_SUFFIX = 'South Australia, Australia';
const PREFERRED_BOUNDARY_TYPES = new Set([
  'suburb',
  'neighbourhood',
  'neighborhood',
  'quarter',
  'city_district',
  'borough',
  'administrative',
]);

const PREFERRED_BOUNDARY_CLASSES = new Set(['boundary', 'place']);

const EXCLUDED_RESULT_TYPES = new Set([
  'copyshop',
  'plumber',
  'station',
  'government',
  'house',
  'residential',
  'yes',
]);

interface NominatimResult {
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  importance?: string | number;
  geojson?: GeoJsonBoundary;
}

interface BoundaryResponse {
  label: string;
  polygonGroups: LatLngLiteral[][][];
  bounds: LatLngBoundsLiteral;
  center: LatLngLiteral;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGeoJsonBoundary(value: unknown): value is GeoJsonBoundary {
  if (!isRecord(value)) {
    return false;
  }

  return value.type === 'Polygon' || value.type === 'MultiPolygon';
}

function parseNominatimResults(payload: unknown): NominatimResult[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter((entry): entry is NominatimResult => isRecord(entry));
}

function scoreBoundaryResult(result: NominatimResult): number {
  if (!isGeoJsonBoundary(result.geojson)) {
    return Number.NEGATIVE_INFINITY;
  }

  if (EXCLUDED_RESULT_TYPES.has(result.type ?? '')) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = Number(result.importance ?? 0);

  if (PREFERRED_BOUNDARY_CLASSES.has(result.class ?? '')) {
    score += 20;
  }

  if (PREFERRED_BOUNDARY_TYPES.has(result.type ?? '')) {
    score += 30;
  }

  if (result.type === 'city') {
    score -= 5;
  }

  if (result.class === 'shop' || result.class === 'amenity' || result.class === 'building') {
    return Number.NEGATIVE_INFINITY;
  }

  return score;
}

function pickBestBoundaryResult(results: NominatimResult[]): NominatimResult | null {
  return (
    [...results]
      .sort((left, right) => scoreBoundaryResult(right) - scoreBoundaryResult(left))
      .find((result) => scoreBoundaryResult(result) > Number.NEGATIVE_INFINITY) ?? null
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const location = typeof req.query.location === 'string' ? req.query.location.trim() : '';

  if (!location) {
    res.status(400).json({ error: 'Missing location query parameter.' });
    return;
  }

  const query = `${location}, ${DEFAULT_REGION_SUFFIX}`;
  const searchParams = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    polygon_geojson: '1',
    limit: '5',
    countrycodes: 'au',
    addressdetails: '1',
  });

  try {
    const nominatimResponse = await fetch(`${NOMINATIM_BASE_URL}?${searchParams.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Gridwell-Energy-OutageMap/1.0 (Sitecore demo)',
      },
    });

    if (!nominatimResponse.ok) {
      res.status(502).json({ error: 'Unable to resolve suburb boundary.' });
      return;
    }

    const results = parseNominatimResults(await nominatimResponse.json());
    const bestMatch = pickBestBoundaryResult(results);

    if (!bestMatch?.geojson) {
      res.status(404).json({ error: 'No suburb boundary found for this location.' });
      return;
    }

    const polygonGroups = geoJsonToPolygonPathGroups(bestMatch.geojson);
    const bounds = boundsFromPolygonPathGroups(polygonGroups);
    const center = centerFromPolygonPathGroups(polygonGroups);

    if (!bounds || !center) {
      res.status(404).json({ error: 'Boundary geometry could not be parsed.' });
      return;
    }

    const payload: BoundaryResponse = {
      label: location,
      polygonGroups,
      bounds,
      center,
    };

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json(payload);
  } catch {
    res.status(502).json({ error: 'Unable to resolve suburb boundary.' });
  }
}
