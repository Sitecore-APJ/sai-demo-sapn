'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseOutageMapField } from '@/lib/customer-notification/parseOutageMapField';
import {
  CustomerNotificationDatasourceGQL,
  CustomerNotificationGQLFields,
  CustomerNotificationPageFields,
} from '@/types/customer-notification';
import { DateField, Text as ContentSdkText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Calendar, MapPin } from 'lucide-react';
import { newsDateFormatter } from '@/helpers/dateHelper';
import { OutageMap } from '@/lib/customer-notification/outage-map/OutageMap';

interface CustomerNotificationProps extends ComponentProps {
  fields: CustomerNotificationGQLFields;
}

function hasDatasourceContent(datasource: CustomerNotificationDatasourceGQL | undefined): boolean {
  return Boolean(
    datasource?.title?.jsonValue?.value ||
    datasource?.outageLocation?.jsonValue?.value ||
    datasource?.outageDate?.jsonValue?.value ||
    datasource?.outageMap?.jsonValue?.value
  );
}

/**
 * Customer notification page content: title, outage details, and map.
 * @param {CustomerNotificationProps} props - Component props from XM Cloud datasource query
 * @returns {JSX.Element | null} The customer notification page content
 */
export const Default = ({ params, fields }: CustomerNotificationProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const datasource = fields?.data?.datasource ?? fields?.data?.contextItem;
  const pageFields = page.layout.sitecore.route?.fields as
    | CustomerNotificationPageFields
    | undefined;
  const hasPageFields = Boolean(
    pageFields?.Title?.value ||
    pageFields?.OutageLocation?.value ||
    pageFields?.OutageDate?.value ||
    pageFields?.OutageMap?.value
  );

  if (!datasource && isPageEditing && !hasPageFields) {
    return (
      <div className={`component customer-notification ${styles ?? ''}`} id={id}>
        [CUSTOMER NOTIFICATION]
      </div>
    );
  }

  if (!datasource && !isPageEditing) {
    return null;
  }

  const outageMapValue = datasource?.outageMap?.jsonValue?.value;
  const mapParseResult = parseOutageMapField(
    typeof outageMapValue === 'string' ? outageMapValue : undefined
  );
  const showContent = hasDatasourceContent(datasource) || isPageEditing;

  if (!showContent && !isPageEditing) {
    return null;
  }

  return (
    <div className={`customer-notification w-full ${styles ?? ''}`} id={id}>
      <div className="container space-y-6 py-8">
        <header className="space-y-4">
          <ContentSdkText
            field={datasource?.title?.jsonValue}
            tag="h1"
            className="text-3xl font-bold tracking-tight"
          />

          <div className="text-foreground-light flex flex-wrap gap-6 text-sm">
            {(datasource?.outageLocation?.jsonValue?.value || isPageEditing) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                <ContentSdkText field={datasource?.outageLocation?.jsonValue} tag="span" />
              </div>
            )}

            {(datasource?.outageDate?.jsonValue?.value || isPageEditing) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                <DateField
                  field={datasource?.outageDate?.jsonValue}
                  render={(date) => (
                    <span>
                      {newsDateFormatter(date) ?? datasource?.outageDate?.jsonValue?.value}
                    </span>
                  )}
                />
              </div>
            )}
          </div>
        </header>

        <section aria-label="Outage map">
          <h2 className="mb-4 text-xl font-semibold">Outage map</h2>
          <OutageMap
            data={mapParseResult.data}
            parseErrors={mapParseResult.errors}
            isEditing={isPageEditing}
          />
        </section>
      </div>
    </div>
  );
};
