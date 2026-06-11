'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageField, NextImage as ContentSdkImage } from '@sitecore-content-sdk/nextjs';
import { createOutageCenterPin } from '@/lib/customer-notification/outage-map/createOutageCenterPin';
import {
  geocodeLocationOverlays,
  LocationOverlay,
} from '@/lib/customer-notification/outage-map/geocodeLocationOverlays';
import { hasOutageMapImage } from '@/lib/customer-notification/outage-map/hasOutageMapImage';
import { OutageMapLegend } from '@/lib/customer-notification/outage-map/OutageMapLegend';
import { CLEAN_MAP_STYLES } from '@/lib/customer-notification/outage-map/outageMapStyles';
import { getOutageStatusStyle } from '@/lib/customer-notification/outage-map/outageStatusStyles';
import { useGoogleMapsLoader } from '@/lib/customer-notification/outage-map/useGoogleMapsLoader';

interface OutageMapProps {
  mapImage?: ImageField;
  locationQuery?: string | null;
  outageStatus?: string;
  isEditing?: boolean;
}

const DEFAULT_MAP_ID = 'DEMO_MAP_ID';

function MapStateMessage({
  title,
  message,
  variant = 'default',
}: {
  title: string;
  message: string;
  variant?: 'default' | 'error';
}) {
  return (
    <div
      className={`flex h-[420px] flex-col items-center justify-center rounded-lg border p-6 text-center ${
        variant === 'error' ? 'border-danger/40 bg-danger/5' : 'border-border bg-background-muted'
      }`}
    >
      <p className="text-base font-semibold">{title}</p>
      <p className="text-foreground-light mt-2 max-w-md text-sm">{message}</p>
    </div>
  );
}

function unionOverlayBounds(overlays: LocationOverlay[]): google.maps.LatLngBoundsLiteral | null {
  if (overlays.length === 0) {
    return null;
  }

  return overlays.reduce<google.maps.LatLngBoundsLiteral>(
    (combined, overlay) => ({
      north: Math.max(combined.north, overlay.bounds.north),
      south: Math.min(combined.south, overlay.bounds.south),
      east: Math.max(combined.east, overlay.bounds.east),
      west: Math.min(combined.west, overlay.bounds.west),
    }),
    { ...overlays[0].bounds }
  );
}

function buildPinInfoWindowContent(label: string, statusLabel: string): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 220px;">
      <p style="font-weight: 700; margin: 0;">${label}</p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #555;">${statusLabel}</p>
    </div>
  `;
}

/**
 * Renders an uploaded outage map image or a clean Google Map with red impacted-area overlays.
 * @param {OutageMapProps} props - Map image, location query, and editing mode flag
 * @returns {JSX.Element} The outage map UI or an appropriate empty, loading, or error state
 */
export function OutageMap({
  mapImage,
  locationQuery,
  outageStatus,
  isEditing = false,
}: OutageMapProps) {
  const statusStyle = getOutageStatusStyle(outageStatus);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const { state, error, mapsApi, markerLibrary } = useGoogleMapsLoader();
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || DEFAULT_MAP_ID;
  const [overlayState, setOverlayState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [overlayErrors, setOverlayErrors] = useState<string[]>([]);
  const [locationOverlays, setLocationOverlays] = useState<LocationOverlay[]>([]);
  const showUploadedImage = hasOutageMapImage(mapImage);
  const hasLocationQuery = Boolean(locationQuery?.trim());

  useEffect(() => {
    if (showUploadedImage || !mapsApi || !hasLocationQuery) {
      setOverlayState('idle');
      setOverlayErrors([]);
      setLocationOverlays([]);
      return;
    }

    let cancelled = false;
    setOverlayState('loading');
    setOverlayErrors([]);
    setLocationOverlays([]);

    geocodeLocationOverlays(mapsApi, locationQuery)
      .then(({ overlays, errors }) => {
        if (cancelled) {
          return;
        }

        if (overlays.length === 0) {
          setOverlayState('error');
          setOverlayErrors(errors);
          return;
        }

        setLocationOverlays(overlays);
        setOverlayState('ready');
        setOverlayErrors(errors);
      })
      .catch(() => {
        if (!cancelled) {
          setOverlayState('error');
          setOverlayErrors(['Unable to resolve the location for the outage map overlay.']);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [showUploadedImage, mapsApi, locationQuery, hasLocationQuery]);

  useEffect(() => {
    if (
      showUploadedImage ||
      !mapsApi ||
      !markerLibrary ||
      !mapContainerRef.current ||
      locationOverlays.length === 0
    ) {
      return;
    }

    const { AdvancedMarkerElement } = markerLibrary;

    if (!mapRef.current) {
      mapRef.current = new mapsApi.Map(mapContainerRef.current, {
        center: { lat: -34.9285, lng: 138.6007 },
        zoom: 11,
        mapId,
        styles: CLEAN_MAP_STYLES,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        clickableIcons: false,
      });
      infoWindowRef.current = new mapsApi.InfoWindow();
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    const overlayStyle = getOutageStatusStyle(outageStatus);

    locationOverlays.forEach((overlay) => {
      overlay.polygonGroups.forEach((paths) => {
        const polygon = new mapsApi.Polygon({
          paths,
          map: mapRef.current,
          fillColor: overlayStyle.fillColor,
          fillOpacity: 0.35,
          strokeColor: overlayStyle.strokeColor,
          strokeOpacity: 0.9,
          strokeWeight: 2,
        });

        overlaysRef.current.push(polygon);
      });

      const marker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: overlay.center,
        title: overlay.label,
        content: createOutageCenterPin(
          overlay.label,
          overlayStyle.pinColor,
          overlayStyle.pinBorderColor
        ),
        zIndex: 20,
      });

      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(
          buildPinInfoWindowContent(overlay.label, overlayStyle.overlayLegendLabel)
        );
        infoWindowRef.current?.open({ map: mapRef.current, anchor: marker });
      });

      markersRef.current.push(marker);
    });

    const combinedBounds = unionOverlayBounds(locationOverlays);

    if (combinedBounds && mapRef.current) {
      mapRef.current.fitBounds(combinedBounds, 48);
    }

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [showUploadedImage, mapsApi, markerLibrary, locationOverlays, mapId, outageStatus]);

  if (showUploadedImage && !isEditing) {
    return (
      <div className="border-border overflow-hidden rounded-lg border">
        <ContentSdkImage field={mapImage} className="h-auto max-h-[520px] w-full object-contain" />
      </div>
    );
  }

  if (!hasLocationQuery) {
    return (
      <MapStateMessage
        title="Outage map"
        message={
          isEditing
            ? 'Upload an Outage Map Image, or enter a suburb in the Location field to generate an impacted-area map.'
            : 'No outage map is available for this notification.'
        }
      />
    );
  }

  if (overlayErrors.length > 0 && overlayState === 'error') {
    return (
      <MapStateMessage
        variant="error"
        title="Outage map could not be loaded"
        message={overlayErrors.join(' ')}
      />
    );
  }

  if (state === 'error') {
    return (
      <MapStateMessage
        variant="error"
        title="Map unavailable"
        message={error ?? 'Unable to load Google Maps.'}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="border-border relative overflow-hidden rounded-lg border">
        {(state === 'loading' || overlayState === 'loading') && (
          <div className="bg-background/80 absolute inset-0 z-20 flex items-center justify-center">
            <p className="text-sm font-medium">Loading map…</p>
          </div>
        )}
        <div
          ref={mapContainerRef}
          className="h-[420px] w-full"
          role="region"
          aria-label="Outage map"
        />
        <OutageMapLegend statusStyle={statusStyle} />
      </div>

      {overlayErrors.length > 0 && overlayState === 'ready' && (
        <p className="text-foreground-light text-sm">{overlayErrors.join(' ')}</p>
      )}
    </div>
  );
}
