export type OutageMapStatus = 'active' | 'planned' | 'restored' | 'archived';

export interface OutageStatusStyle {
  fillColor: string;
  strokeColor: string;
  pinColor: string;
  pinBorderColor: string;
  overlayLegendLabel: string;
}

export const OUTAGE_STATUS_STYLES: Record<OutageMapStatus, OutageStatusStyle> = {
  active: {
    fillColor: '#DC2626',
    strokeColor: '#DC2626',
    pinColor: '#DC2626',
    pinBorderColor: '#7F1D1D',
    overlayLegendLabel: 'Active outage boundary',
  },
  planned: {
    fillColor: '#D97706',
    strokeColor: '#D97706',
    pinColor: '#D97706',
    pinBorderColor: '#92400E',
    overlayLegendLabel: 'Planned outage boundary',
  },
  restored: {
    fillColor: '#16A34A',
    strokeColor: '#16A34A',
    pinColor: '#16A34A',
    pinBorderColor: '#166534',
    overlayLegendLabel: 'Restored boundary',
  },
  archived: {
    fillColor: '#6B7280',
    strokeColor: '#6B7280',
    pinColor: '#6B7280',
    pinBorderColor: '#374151',
    overlayLegendLabel: 'Archived boundary',
  },
};

/**
 * Normalizes a Sitecore droplist value to a map status slug.
 * @param {string | undefined} value - Raw Outage Status field value
 * @returns {OutageMapStatus} Normalized outage map status
 */
export function normalizeOutageMapStatus(value: string | undefined): OutageMapStatus {
  const normalized = value?.trim()?.toLowerCase();

  if (normalized === 'planned' || normalized === 'restored' || normalized === 'archived') {
    return normalized;
  }

  return 'active';
}

/**
 * Returns overlay and pin styling for the given outage status.
 * @param {string | undefined} statusValue - Raw Outage Status field value
 * @returns {OutageStatusStyle} Colors and legend label for the status
 */
export function getOutageStatusStyle(statusValue: string | undefined): OutageStatusStyle {
  return OUTAGE_STATUS_STYLES[normalizeOutageMapStatus(statusValue)];
}
