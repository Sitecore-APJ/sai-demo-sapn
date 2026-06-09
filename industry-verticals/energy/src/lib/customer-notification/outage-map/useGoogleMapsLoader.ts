'use client';

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useState } from 'react';

type LoaderState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Loads the Google Maps JavaScript API for client-side outage map rendering.
 * @returns {{ state: LoaderState; error: string | null; mapsApi: typeof google.maps | null }} Loader state, error message, and maps API when ready
 */
export function useGoogleMapsLoader() {
  const [state, setState] = useState<LoaderState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mapsApi, setMapsApi] = useState<typeof google.maps | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setState('error');
      setError('Google Maps API key is not configured.');
      return;
    }

    let cancelled = false;
    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    setState('loading');

    loader
      .importLibrary('maps')
      .then(() => {
        if (!cancelled) {
          setMapsApi(window.google.maps);
          setState('ready');
        }
      })
      .catch((loadError: Error) => {
        if (!cancelled) {
          setState('error');
          setError(loadError.message || 'Failed to load Google Maps.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { state, error, mapsApi };
}
