'use client';

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useState } from 'react';

type LoaderState = 'idle' | 'loading' | 'ready' | 'error';

function getMapsConfigurationError(): string | null {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return 'Google Maps API key is not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.';
  }

  return null;
}

function getMapsRuntimeErrorMessage(reason: string): string {
  if (reason.includes('ApiNotActivatedMapError')) {
    return 'Maps JavaScript API is not enabled for this API key. Enable it in Google Cloud Console under APIs & Services.';
  }

  if (reason.includes('InvalidKeyMapError') || reason.includes('RefererNotAllowedMapError')) {
    return 'Google Maps API key is invalid or not allowed for this site. Check key restrictions in Google Cloud Console.';
  }

  return reason;
}

/**
 * Loads the Google Maps JavaScript API for client-side outage map rendering.
 * @returns Loader state, error message, and maps API when ready
 */
export function useGoogleMapsLoader() {
  const [state, setState] = useState<LoaderState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mapsApi, setMapsApi] = useState<typeof google.maps | null>(null);
  const [markerLibrary, setMarkerLibrary] = useState<typeof google.maps.marker | null>(null);

  useEffect(() => {
    const configurationError = getMapsConfigurationError();

    if (configurationError) {
      setState('error');
      setError(configurationError);
      return;
    }

    let cancelled = false;
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    const previousAuthFailureHandler = window.gm_authFailure;
    window.gm_authFailure = () => {
      if (!cancelled) {
        setState('error');
        setError(
          'Google Maps authentication failed. Verify the API key and enable Maps JavaScript API in Google Cloud Console.'
        );
      }
    };

    setState('loading');

    Promise.all([loader.importLibrary('maps'), loader.importLibrary('marker')])
      .then(() => {
        if (!cancelled) {
          setMapsApi(window.google.maps);
          setMarkerLibrary(window.google.maps.marker);
          setState('ready');
        }
      })
      .catch((loadError: Error) => {
        if (!cancelled) {
          setState('error');
          setError(getMapsRuntimeErrorMessage(loadError.message || 'Failed to load Google Maps.'));
        }
      });

    return () => {
      cancelled = true;
      window.gm_authFailure = previousAuthFailureHandler;
    };
  }, []);

  return { state, error, mapsApi, markerLibrary };
}
