'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { newsDateFormatter } from '@/helpers/dateHelper';
import { OutageMapData, OutagePin, OutageStatus } from '@/types/customer-notification';
import { OutageMapLegend } from './OutageMapLegend';
import { OUTAGE_MARKER_COLORS, OUTAGE_STATUS_LABELS } from './outageMapMarkers';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';

interface OutageMapProps {
  data: OutageMapData | null;
  parseErrors?: string[];
  isEditing?: boolean;
}

const ALL_STATUSES: OutageStatus[] = ['active', 'planned', 'restored'];

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

function buildInfoWindowContent(pin: OutagePin): string {
  const formattedDate = newsDateFormatter(new Date(pin.date)) ?? pin.date;

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 220px;">
      <p style="font-weight: 700; margin: 0 0 4px;">${pin.title}</p>
      <p style="margin: 0 0 4px; font-size: 13px;">${pin.location}</p>
      <p style="margin: 0 0 4px; font-size: 12px; text-transform: capitalize;">${pin.status}</p>
      <p style="margin: 0; font-size: 12px; color: #555;">${formattedDate}</p>
    </div>
  `;
}

/**
 * Renders an interactive Google Maps outage map with status filters and legend.
 * @param {OutageMapProps} props - Map data, parse errors, and editing mode flag
 * @returns {JSX.Element} The outage map UI or an appropriate empty, loading, or error state
 */
export function OutageMap({ data, parseErrors = [], isEditing = false }: OutageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const { state, error, mapsApi } = useGoogleMapsLoader();

  const availableStatuses = useMemo(() => {
    if (!data?.outages.length) {
      return [];
    }

    return ALL_STATUSES.filter((status) => data.outages.some((pin) => pin.status === status));
  }, [data]);

  const [visibleStatuses, setVisibleStatuses] = useState<OutageStatus[]>(ALL_STATUSES);

  useEffect(() => {
    setVisibleStatuses(availableStatuses.length > 0 ? availableStatuses : ALL_STATUSES);
  }, [availableStatuses]);

  const visibleOutages = useMemo(
    () => data?.outages.filter((pin) => visibleStatuses.includes(pin.status)) ?? [],
    [data, visibleStatuses]
  );

  useEffect(() => {
    if (!mapsApi || !mapContainerRef.current || !data) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new mapsApi.Map(mapContainerRef.current, {
        center: data.center,
        zoom: data.zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      infoWindowRef.current = new mapsApi.InfoWindow();
    } else {
      mapRef.current.setCenter(data.center);
      mapRef.current.setZoom(data.zoom);
    }
  }, [mapsApi, data]);

  useEffect(() => {
    if (!mapsApi || !mapRef.current) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    visibleOutages.forEach((pin) => {
      const marker = new mapsApi.Marker({
        map: mapRef.current,
        position: { lat: pin.lat, lng: pin.lng },
        title: pin.title,
        icon: {
          path: mapsApi.SymbolPath.CIRCLE,
          fillColor: OUTAGE_MARKER_COLORS[pin.status],
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 9,
        },
      });

      marker.addListener('click', () => {
        infoWindowRef.current?.setContent(buildInfoWindowContent(pin));
        infoWindowRef.current?.open({ map: mapRef.current, anchor: marker });
      });

      markersRef.current.push(marker);
    });
  }, [mapsApi, visibleOutages]);

  const toggleStatus = (status: OutageStatus) => {
    setVisibleStatuses((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status]
    );
  };

  if (parseErrors.length > 0) {
    return (
      <MapStateMessage
        variant="error"
        title="Outage map could not be loaded"
        message={parseErrors.join(' ')}
      />
    );
  }

  if (!data?.outages.length) {
    if (isEditing) {
      return (
        <MapStateMessage
          title="Outage map"
          message='Add coordinates to the Outage Map field (e.g. "-34.9285, 138.6007") to display the map.'
        />
      );
    }

    return (
      <MapStateMessage
        title="No outage map data"
        message="There are no outages to display on the map."
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
      {availableStatuses.length > 1 && (
        <div className="flex flex-wrap gap-4">
          {availableStatuses.map((status) => (
            <label key={status} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-accent h-4 w-4"
                checked={visibleStatuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: OUTAGE_MARKER_COLORS[status] }}
                aria-hidden
              />
              {OUTAGE_STATUS_LABELS[status]}
            </label>
          ))}
        </div>
      )}

      <div className="border-border relative overflow-hidden rounded-lg border">
        {state === 'loading' && (
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
        <OutageMapLegend statuses={availableStatuses} />
      </div>
    </div>
  );
}
