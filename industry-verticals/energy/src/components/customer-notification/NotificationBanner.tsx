'use client';

import { ComponentProps } from '@/lib/component-props';
import { isCheckboxFieldEnabled } from '@/lib/customer-notification/isCheckboxFieldEnabled';
import { resolveBannerUpdateItems } from '@/lib/customer-notification/resolveBannerUpdateItems';
import { selectBannerContent } from '@/lib/customer-notification/selectBannerUpdate';
import {
  BannerContent,
  CustomerNotificationPageFields,
  NotificationBannerGQLFields,
  UpdateItemStatus,
} from '@/types/customer-notification';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { AlertTriangle } from 'lucide-react';
import { notificationDateTimeFormatter } from '@/helpers/dateHelper';

interface NotificationBannerProps extends ComponentProps {
  fields: NotificationBannerGQLFields;
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

function NotificationBannerAlert({ content }: { content: BannerContent }) {
  const formattedDate = content.dateTime
    ? (notificationDateTimeFormatter(new Date(content.dateTime)) ?? null)
    : null;

  return (
    <div className="border-danger/30 bg-danger/10 border-b px-4 py-4" role="alert">
      <div className="container flex items-start gap-3">
        <AlertTriangle className="text-danger mt-0.5 h-5 w-5 shrink-0" aria-hidden />
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

/**
 * Sitecore rendering that shows the latest active update banner when enabled on the page.
 * @param {NotificationBannerProps} props - Component props from XM Cloud datasource query
 * @returns {JSX.Element | null} The notification banner or an editing placeholder
 */
export const Default = ({ params, fields }: NotificationBannerProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const gqlDatasource = fields?.data?.datasource;
  const pageFields = page.layout.sitecore.route?.fields as
    | CustomerNotificationPageFields
    | undefined;
  const showLatestUpdateBanner = isCheckboxFieldEnabled(
    gqlDatasource?.banner?.jsonValue?.value ?? pageFields?.Banner?.value
  );

  const bannerContent = selectBannerContent(
    resolveBannerUpdateItems(fields),
    showLatestUpdateBanner
  );

  if (bannerContent) {
    return (
      <div className={`notification-banner w-full ${styles ?? ''}`} id={id}>
        <NotificationBannerAlert content={bannerContent} />
      </div>
    );
  }

  if (isPageEditing) {
    return (
      <div className={`notification-banner w-full ${styles ?? ''}`} id={id}>
        <div className="border-border bg-background-muted border-b px-4 py-3 text-center text-sm">
          {showLatestUpdateBanner
            ? 'Banner hidden — add an active Update Item with a title.'
            : 'Banner hidden — enable Latest Info Banner on the page.'}
        </div>
      </div>
    );
  }

  return null;
};
