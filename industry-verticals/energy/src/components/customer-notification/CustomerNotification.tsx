'use client';

import { ComponentProps } from '@/lib/component-props';
import { buildOutageMapFromPageFields } from '@/lib/customer-notification/buildOutageMapFromPageFields';
import { hasRichTextContent } from '@/lib/customer-notification/richTextFieldUtils';
import { CustomerNotificationPageFields } from '@/types/customer-notification';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import {
  DateField,
  Text as ContentSdkText,
  RichText as ContentSdkRichText,
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
    pageFields.OutageLocation?.value ||
    pageFields.OutageDate?.value ||
    pageFields.OutageSummary?.value ||
    hasRichTextContent(pageFields.OutageDescription) ||
    pageFields.OutageLocationPinOnMap?.value
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
  const mapParseResult = buildOutageMapFromPageFields(pageFields);

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

  const showLocation = Boolean(pageFields.OutageLocation?.value) || isPageEditing;
  const showOutageDate = !isFieldValueEmpty(pageFields.OutageDate) || isPageEditing;

  return (
    <div className={`customer-notification w-full ${styles ?? ''}`} id={id}>
      <div className="container space-y-6 py-8">
        <header className="space-y-4">
          <ContentSdkText
            field={pageFields?.Title}
            tag="h1"
            className="text-3xl font-bold tracking-tight"
          />

          {(showLocation || showOutageDate) && (
            <div className="text-foreground-light flex flex-wrap gap-6 text-sm">
              {showLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  <ContentSdkText
                    field={pageFields?.OutageLocation}
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
            </div>
          )}
        </header>

        <section aria-label="Outage map" className="space-y-4">
          <h2 className="text-xl font-semibold">Outage map</h2>
          <div className="text-foreground-light space-y-1 text-sm">
            <p className="font-medium">Outage location pin on map</p>
            <ContentSdkText field={pageFields?.OutageLocationPinOnMap} tag="p" />
          </div>
          <OutageMap
            data={mapParseResult.data}
            parseErrors={mapParseResult.errors}
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
