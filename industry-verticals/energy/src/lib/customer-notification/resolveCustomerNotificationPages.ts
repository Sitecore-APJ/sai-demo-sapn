import {
  CustomerNotificationPageGQL,
  CustomerNotificationPageSummary,
  NotificationStatus,
  OutageStatus,
} from '@/types/customer-notification';

const VALID_NOTIFICATION_STATUSES: NotificationStatus[] = ['Active', 'Archived'];
const VALID_OUTAGE_STATUSES: OutageStatus[] = ['Active', 'Planned', 'Restored'];

function toStringFieldValue(value: string | number | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parseNotificationStatus(value: string | undefined): NotificationStatus {
  if (value && VALID_NOTIFICATION_STATUSES.includes(value as NotificationStatus)) {
    return value as NotificationStatus;
  }

  return 'Active';
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
  const title = toStringFieldValue(item.title?.jsonValue?.value)?.trim();

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
    notificationStatus: parseNotificationStatus(
      toStringFieldValue(item.notificationStatus?.jsonValue?.value)
    ),
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

export function filterNotificationsByStatus(
  notifications: CustomerNotificationPageSummary[],
  status: NotificationStatus
): CustomerNotificationPageSummary[] {
  return notifications.filter((notification) => notification.notificationStatus === status);
}
