import {
  CustomerNotificationPageGQL,
  CustomerNotificationPageSummary,
  OutageStatus,
} from '@/types/customer-notification';

const VALID_OUTAGE_STATUSES: OutageStatus[] = ['Active', 'Planned', 'Restored', 'Archived'];

function toStringFieldValue(value: string | number | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parseOutageStatus(value: string | undefined): OutageStatus | undefined {
  if (value && VALID_OUTAGE_STATUSES.includes(value as OutageStatus)) {
    return value as OutageStatus;
  }

  return undefined;
}

function mapNotificationPage(
  item: CustomerNotificationPageGQL
): CustomerNotificationPageSummary | null {
  const title = toStringFieldValue(item.title?.jsonValue?.value)?.trim() || item.name?.trim();

  if (!title) {
    return null;
  }

  return {
    id: item.id,
    title,
    location: toStringFieldValue(item.location?.jsonValue?.value),
    outageDate: toStringFieldValue(item.outageDate?.jsonValue?.value),
    outageSummary: toStringFieldValue(item.outageSummary?.jsonValue?.value),
    outageStatus: parseOutageStatus(toStringFieldValue(item.outageStatus?.jsonValue?.value)),
    url: item.url?.path,
  };
}

/** Resolves child Customer Notification pages from the overview GraphQL context item. */
export function resolveCustomerNotificationPages(
  items: CustomerNotificationPageGQL[] | undefined
): CustomerNotificationPageSummary[] {
  return (items ?? [])
    .map(mapNotificationPage)
    .filter((item): item is CustomerNotificationPageSummary => item !== null);
}

export function filterActiveNotifications(
  notifications: CustomerNotificationPageSummary[]
): CustomerNotificationPageSummary[] {
  return notifications.filter((notification) => notification.outageStatus !== 'Archived');
}

export function filterArchivedNotifications(
  notifications: CustomerNotificationPageSummary[]
): CustomerNotificationPageSummary[] {
  return notifications.filter((notification) => notification.outageStatus === 'Archived');
}
