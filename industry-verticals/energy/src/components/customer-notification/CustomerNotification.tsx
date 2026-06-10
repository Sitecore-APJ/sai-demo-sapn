'use client';

import { ComponentProps } from '@/lib/component-props';
import { hasOutageMapImage } from '@/lib/customer-notification/outage-map/hasOutageMapImage';
import { hasRichTextContent } from '@/lib/customer-notification/richTextFieldUtils';
import { CustomerNotificationPageFields } from '@/types/customer-notification';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import {
  DateField,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
  NextImage as ContentSdkImage,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Calendar, MapPin } from 'lucide-react';
import { newsDateFormatter } from '@/helpers/dateHelper';
import { OutageMap } from '@/lib/customer-notification/outage-map/OutageMap';

interface CustomerNotificationProps extends ComponentProps {
  fields: CustomerNotificationPageFields;
}

function hasPageContent(pageFields: CustomerNotificationPageFields | undefined): boolean {
  if (!pageFields) {
    return false;
  }

  return Boolean(
    pageFields.Title?.value ||
    pageFields.Location?.value ||
    pageFields.OutageDate?.value ||
    pageFields.OutageSummary?.value ||
    hasRichTextContent(pageFields.OutageDescription) ||
    hasOutageMapImage(pageFields.OutageMap)
  );
}

/**
 * Customer notification page content bound to the current page fields.
 * @param {CustomerNotificationProps} props - Component props from page layout
 * @returns {JSX.Element} The customer notification page content
 */
export const Default = ({ params, fields }: CustomerNotificationProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const pageFields = (fields ?? page.layout.sitecore.route?.fields) as
    | CustomerNotificationPageFields
    | undefined;

  if (!pageFields) {
    return isPageEditing ? (
      <div className={`component customer-notification ${styles ?? ''}`} id={id}>
        [CUSTOMER NOTIFICATION]
      </div>
    ) : null;
  }

  if (!hasPageContent(pageFields) && !isPageEditing) {
    return null;
  }

  const showLocation = Boolean(pageFields.Location?.value) || isPageEditing;
  const showOutageDate = !isFieldValueEmpty(pageFields.OutageDate) || isPageEditing;
  const showOutageStatus = Boolean(pageFields.OutageStatus?.value) || isPageEditing;

  return (
    <div className={`customer-notification w-full ${styles ?? ''}`} id={id}>
      <div className="container space-y-6 py-8">
        <header className="space-y-4">
          <ContentSdkText
            field={pageFields?.Title}
            tag="h1"
            className="text-3xl font-bold tracking-tight"
          />

          {(showLocation || showOutageDate || showOutageStatus) && (
            <div className="text-foreground-light flex flex-wrap gap-6 text-sm">
              {showLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  <ContentSdkText
                    field={pageFields.Location}
                    tag="span"
                    className="text-foreground-light text-base"
                  />
                </div>
              )}

              {showOutageDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                  {!isFieldValueEmpty(pageFields.OutageDate) ? (
                    <DateField
                      field={pageFields.OutageDate}
                      render={(date) => (
                        <span>
                          {newsDateFormatter(date) ??
                            pageFields.OutageDate?.value ??
                            '[Outage Date]'}
                        </span>
                      )}
                    />
                  ) : (
                    <span className="text-foreground-light text-sm">[Outage Date]</span>
                  )}
                </div>
              )}

              {showOutageStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground-light text-sm">Status:</span>
                  <ContentSdkText field={pageFields.OutageStatus} tag="span" />
                </div>
              )}
            </div>
          )}
        </header>

        <section aria-label="Outage map" className="space-y-4">
          <h2 className="text-xl font-semibold">Outage map</h2>
          {isPageEditing && (
            <div className="space-y-3">
              <p className="text-foreground-light text-sm">
                Upload an Outage Map Image below, or leave it empty to auto-generate a map from the
                Location field.
              </p>
              <div className="border-border bg-background-muted rounded-lg border border-dashed p-4">
                <p className="mb-2 text-sm font-medium">Outage Map Image</p>
                <ContentSdkImage field={pageFields.OutageMap} className="max-h-48 w-auto rounded" />
              </div>
            </div>
          )}
          <OutageMap
            mapImage={pageFields.OutageMap}
            locationQuery={pageFields.Location?.value}
            outageStatus={pageFields.OutageStatus?.value}
            isEditing={isPageEditing}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Outage summary</h2>
          <ContentSdkText
            field={pageFields?.OutageSummary}
            tag="p"
            className="text-foreground-light text-base"
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Outage description</h2>
          <div className="ck-content text-foreground-light">
            <ContentSdkRichText field={pageFields?.OutageDescription} />
          </div>
        </section>
      </div>
    </div>
  );
};
