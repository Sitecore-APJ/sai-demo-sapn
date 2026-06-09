import { BannerContent, UpdateItemStatus } from '@/types/customer-notification';
import { AlertTriangle } from 'lucide-react';
import { notificationDateTimeFormatter } from '@/helpers/dateHelper';

interface NotificationBannerProps {
  content: BannerContent;
}

function statusToDataAttribute(status: UpdateItemStatus): string {
  switch (status) {
    case 'Active':
      return 'active';
    case 'Resolved':
    case 'Cancelled':
      return 'restored';
    default:
      return 'active';
  }
}

/**
 * Displays a customer notification alert banner from an update item or page fallback.
 * @param {NotificationBannerProps} props - Banner title, message, status, and optional timestamp
 * @returns {JSX.Element} The rendered notification banner
 */
export function NotificationBanner({ content }: NotificationBannerProps) {
  const formattedDate = content.dateTime
    ? (notificationDateTimeFormatter(new Date(content.dateTime)) ?? null)
    : null;

  return (
    <div
      className={`border-b px-4 py-4 ${
        content.source === 'update'
          ? 'border-danger/30 bg-danger/10'
          : 'border-warning/30 bg-warning/10'
      }`}
      role="alert"
    >
      <div className="container flex items-start gap-3">
        <AlertTriangle
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            content.source === 'update' ? 'text-danger' : 'text-warning'
          }`}
          aria-hidden
        />
        <div className="space-y-1">
          {content.title && <p className="text-base font-bold">{content.title}</p>}
          <p className="text-sm leading-relaxed">{content.message}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {content.status && (
              <span
                className="grid-outage-status"
                data-status={statusToDataAttribute(content.status)}
              >
                {content.status}
              </span>
            )}
            {formattedDate && (
              <span className="text-foreground-light text-xs">{formattedDate}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
