import { newsDateFormatter } from '@/helpers/dateHelper';
import { outageStatusBadgeAttribute } from '@/lib/customer-notification/notifications-overview/outageStatusBadgeAttribute';
import { CustomerNotificationPageSummary } from '@/types/customer-notification';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';

interface NotificationListProps {
  notifications: CustomerNotificationPageSummary[];
  emptyMessage: string;
}

function formatOutageDate(value: string | undefined): string | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  return newsDateFormatter(new Date(value)) ?? value;
}

/**
 * List of customer notification pages with location, date, and outage status.
 */
export function NotificationList({ notifications, emptyMessage }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="border-border bg-background-muted rounded-lg border px-4 py-8 text-center text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => {
        const formattedDate = formatOutageDate(notification.outageDate);
        const content = (
          <div className="border-border hover:border-accent flex items-start justify-between gap-4 rounded-lg border px-4 py-4 transition-colors">
            <div className="space-y-2">
              <p className="text-base font-semibold">{notification.title}</p>
              {notification.outageSummary && (
                <p className="text-foreground-light text-sm">{notification.outageSummary}</p>
              )}
              <div className="text-foreground-light flex flex-wrap items-center gap-4 text-sm">
                {notification.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    {notification.location}
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {notification.outageStatus && (
                <span
                  className="grid-outage-status"
                  data-status={outageStatusBadgeAttribute(notification.outageStatus)}
                >
                  {notification.outageStatus}
                </span>
              )}
              {notification.url && <ChevronRight className="text-foreground-light h-5 w-5" />}
            </div>
          </div>
        );

        return (
          <li key={notification.id}>
            {notification.url ? (
              <Link href={notification.url} className="block">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
