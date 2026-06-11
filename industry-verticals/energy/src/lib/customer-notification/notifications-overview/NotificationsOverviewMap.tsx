'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createOutageCenterPin } from '@/lib/customer-notification/outage-map/createOutageCenterPin';
import {
  geocodeLocationOverlays,
  LocationOverlay,
} from '@/lib/customer-notification/outage-map/geocodeLocationOverlays';
import { CLEAN_MAP_STYLES } from '@/lib/customer-notification/outage-map/outageMapStyles';
import { getOutageStatusStyle } from '@/lib/customer-notification/outage-map/outageStatusStyles';
import { useGoogleMapsLoader } from '@/lib/customer-notification/outage-map/useGoogleMapsLoader';
import { OverviewMapLegend } from '@/lib/customer-notification/notifications-overview/OverviewMapLegend';
import { CustomerNotificationPageSummary } from '@/types/customer-notification';

interface NotificationMapOverlay extends LocationOverlay {
  notification: CustomerNotificationPageSummary;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const DEFAULT_MAP_ID = 'DEMO_MAP_ID';

function unionOverlayBounds(
  overlays: NotificationMapOverlay[]
): google.maps.LatLngBoundsLiteral | null {
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

function buildPinInfoWindowContent(notification: CustomerNotificationPageSummary): string {
  const title = escapeHtml(notification.title);
  const statusLabel = escapeHtml(notification.outageStatus ?? 'Active');
  const location = notification.location ? escapeHtml(notification.location) : '';
  const link = notification.url
    ? `<a href="${escapeHtml(notification.url)}" style="color: #2563eb; font-size: 12px;">View notification</a>`
    : '';

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 240px;">
      <p style="font-weight: 700; margin: 0;">${title}</p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #555;">${statusLabel}</p>
      ${location ? `<p style="margin: 4px 0 0; font-size: 12px; color: #555;">${location}</p>` : ''}
      ${link ? `<p style="margin: 8px 0 0;">${link}</p>` : ''}
    </div>
  `;
}

interface NotificationsOverviewMapProps {
  notifications: CustomerNotificationPageSummary[];
}

/**
 * Map showing impacted-area overlays for all active customer notifications.
 */
export function NotificationsOverviewMap({ notifications }: NotificationsOverviewMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const { state, error, mapsApi, markerLibrary } = useGoogleMapsLoader();
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || DEFAULT_MAP_ID;
  const [overlayState, setOverlayState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [overlayErrors, setOverlayErrors] = useState<string[]>([]);
  const [notificationOverlays, setNotificationOverlays] = useState<NotificationMapOverlay[]>([]);

  const mappableNotifications = useMemo(
    () => notifications.filter((notification) => Boolean(notification.location?.trim())),
    [notifications]
  );

  useEffect(() => {
    if (!mapsApi || mappableNotifications.length === 0) {
      setOverlayState(mappableNotifications.length === 0 ? 'idle' : 'loading');
      setOverlayErrors([]);
      setNotificationOverlays([]);
      return;
    }

    let cancelled = false;
    setOverlayState('loading');
    setOverlayErrors([]);
    setNotificationOverlays([]);

    Promise.all(
      mappableNotifications.map(async (notification) => {
        const { overlays, errors } = await geocodeLocationOverlays(mapsApi, notification.location);

        return {
          notification,
          overlays: overlays.map((overlay) => ({
            ...overlay,
            notification,
          })),
          errors,
        };
      })
    )
      .then((results) => {
        if (cancelled) {
          return;
        }

        const overlays = results.flatMap((result) => result.overlays);
        const errors = results.flatMap((result) => result.errors);

        if (overlays.length === 0) {
          setOverlayState('error');
          setOverlayErrors(
            errors.length > 0
              ? errors
              : ['Could not map any active notifications. Check Location values on child pages.']
          );
          return;
        }

        setNotificationOverlays(overlays);
        setOverlayState('ready');
        setOverlayErrors(errors);
      })
      .catch(() => {
        if (!cancelled) {
          setOverlayState('error');
          setOverlayErrors(['Unable to load notification map overlays.']);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mapsApi, mappableNotifications]);

  useEffect(() => {
    if (
      !mapsApi ||
      !markerLibrary ||
      !mapContainerRef.current ||
      notificationOverlays.length === 0
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

    const pinsByNotification = new Map<string, CustomerNotificationPageSummary>();

    notificationOverlays.forEach((overlay) => {
      const statusStyle = getOutageStatusStyle(overlay.notification.outageStatus);

      overlay.polygonGroups.forEach((paths) => {
        const polygon = new mapsApi.Polygon({
          paths,
          map: mapRef.current,
          fillColor: statusStyle.fillColor,
          fillOpacity: 0.3,
          strokeColor: statusStyle.strokeColor,
          strokeOpacity: 0.9,
          strokeWeight: 2,
        });

        overlaysRef.current.push(polygon);
      });

      if (!pinsByNotification.has(overlay.notification.id)) {
        pinsByNotification.set(overlay.notification.id, overlay.notification);
      }
    });

    pinsByNotification.forEach((notification, notificationId) => {
      const overlay = notificationOverlays.find((item) => item.notification.id === notificationId);

      if (!overlay) {
        return;
      }

      const statusStyle = getOutageStatusStyle(notification.outageStatus);
      const marker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: overlay.center,
        title: notification.title,
        content: createOutageCenterPin(
          notification.title,
          statusStyle.pinColor,
          statusStyle.pinBorderColor
        ),
        zIndex: 20,
      });

      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(buildPinInfoWindowContent(notification));
        infoWindowRef.current?.open({ map: mapRef.current, anchor: marker });
      });

      markersRef.current.push(marker);
    });

    const combinedBounds = unionOverlayBounds(notificationOverlays);

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
  }, [mapsApi, markerLibrary, notificationOverlays, mapId]);

  if (notifications.length === 0) {
    return (
      <div className="border-border bg-background-muted flex h-[420px] flex-col items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-base font-semibold">No active notifications</p>
        <p className="text-foreground-light mt-2 max-w-md text-sm">
          Active customer notification pages will appear on the map and in the list below.
        </p>
      </div>
    );
  }

  if (mappableNotifications.length === 0) {
    return (
      <div className="border-border bg-background-muted flex h-[420px] flex-col items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-base font-semibold">No map locations available</p>
        <p className="text-foreground-light mt-2 max-w-md text-sm">
          Add a Location value to active notification pages to display them on the map.
        </p>
      </div>
    );
  }

  if (overlayState === 'error') {
    return (
      <div className="border-danger/40 bg-danger/5 flex h-[420px] flex-col items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-base font-semibold">Notification map could not be loaded</p>
        <p className="text-foreground-light mt-2 max-w-md text-sm">{overlayErrors.join(' ')}</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="border-danger/40 bg-danger/5 flex h-[420px] flex-col items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-base font-semibold">Map unavailable</p>
        <p className="text-foreground-light mt-2 max-w-md text-sm">
          {error ?? 'Unable to load Google Maps.'}
        </p>
      </div>
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
          aria-label="Active notifications map"
        />
        <OverviewMapLegend />
      </div>

      {overlayErrors.length > 0 && overlayState === 'ready' && (
        <p className="text-foreground-light text-sm">{overlayErrors.join(' ')}</p>
      )}
    </div>
  );
}
