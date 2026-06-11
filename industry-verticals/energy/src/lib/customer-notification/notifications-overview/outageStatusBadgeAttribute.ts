import { OutageStatus } from '@/types/customer-notification';

/** Maps outage status to grid-outage-status data-status attribute values. */
export function outageStatusBadgeAttribute(status: OutageStatus | undefined): string {
  switch (status) {
    case 'Planned':
      return 'planned';
    case 'Restored':
    case 'Archived':
      return 'restored';
    case 'Active':
    default:
      return 'active';
  }
}
