import { BannerContent, UpdateItemGQL, UpdateItemStatus } from '@/types/customer-notification';
import { Field } from '@sitecore-content-sdk/nextjs';

const VALID_UPDATE_STATUSES: UpdateItemStatus[] = ['Active', 'Resolved', 'Cancelled'];

function parseUpdateItemStatus(value: string | undefined): UpdateItemStatus | undefined {
  if (!value || !VALID_UPDATE_STATUSES.includes(value as UpdateItemStatus)) {
    return undefined;
  }

  return value as UpdateItemStatus;
}

function parseUpdateTimestamp(value: string | undefined): number | null {
  if (!value?.trim()) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

/**
 * Selects banner content from the latest active update item or falls back to the page Banner field.
 * @param {UpdateItemGQL[] | undefined} updateItems - Child update items from the page datasource
 * @param {Field<string> | undefined} fallbackBanner - Page Banner field used when no active update has a title
 * @returns {BannerContent | null} Resolved banner content, or null when nothing should be displayed
 */
export function selectBannerContent(
  updateItems: UpdateItemGQL[] | undefined,
  fallbackBanner: Field<string> | undefined
): BannerContent | null {
  const activeUpdates = (updateItems ?? [])
    .filter((item) => item.updateStatus?.jsonValue?.value === 'Active')
    .sort((a, b) => {
      const timeA = parseUpdateTimestamp(a.updateDateTime?.jsonValue?.value);
      const timeB = parseUpdateTimestamp(b.updateDateTime?.jsonValue?.value);

      if (timeA === null && timeB === null) {
        return 0;
      }

      if (timeA === null) {
        return 1;
      }

      if (timeB === null) {
        return -1;
      }

      return timeB - timeA;
    });

  const latest = activeUpdates[0];
  const latestTitle = latest?.updateTitle?.jsonValue?.value?.trim();

  if (latestTitle) {
    const status = parseUpdateItemStatus(latest.updateStatus?.jsonValue?.value);

    return {
      source: 'update',
      title: latestTitle,
      message: latest.updateMessage?.jsonValue?.value ?? '',
      ...(status ? { status } : {}),
      dateTime: latest.updateDateTime?.jsonValue?.value,
    };
  }

  const bannerText = fallbackBanner?.value?.trim();

  if (bannerText) {
    return { source: 'fallback', title: '', message: bannerText };
  }

  return null;
}
