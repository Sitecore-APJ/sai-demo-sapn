import { OutageStatus } from '@/types/customer-notification';

export const OUTAGE_MARKER_COLORS: Record<OutageStatus, string> = {
  active: '#DC2626',
  planned: '#D97706',
  restored: '#16A34A',
};

export const OUTAGE_STATUS_LABELS: Record<OutageStatus, string> = {
  active: 'Active outages',
  planned: 'Planned outages',
  restored: 'Restored outages',
};
