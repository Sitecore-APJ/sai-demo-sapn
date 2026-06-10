import { BannerContent, UpdateItemGQL, UpdateItemStatus } from '@/types/customer-notification';
import { isCheckboxFieldEnabled } from '@/lib/customer-notification/isCheckboxFieldEnabled';

const VALID_UPDATE_STATUSES: UpdateItemStatus[] = ['Active', 'Resolved', 'Cancelled'];

function toStringFieldValue(value: string | number | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

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
 * Selects banner content from the latest active update item when the page banner toggle is enabled.
 * @param {UpdateItemGQL[] | undefined} updateItems - Child update items from the page datasource
 * @param {boolean | string | number | undefined | null} showLatestUpdateBanner - Page Banner checkbox value
 * @returns {BannerContent | null} Resolved banner content, or null when the banner should be hidden
 */
export function selectBannerContent(
  updateItems: UpdateItemGQL[] | undefined,
  showLatestUpdateBanner: boolean | string | number | undefined | null
): BannerContent | null {
  if (!isCheckboxFieldEnabled(showLatestUpdateBanner)) {
    return null;
  }

  const activeUpdates = (updateItems ?? [])
    .filter((item) => item.updateStatus?.jsonValue?.value === 'Active')
    .sort((a, b) => {
      const timeA = parseUpdateTimestamp(toStringFieldValue(a.updateDateTime?.jsonValue?.value));
      const timeB = parseUpdateTimestamp(toStringFieldValue(b.updateDateTime?.jsonValue?.value));

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
  const latestTitle = toStringFieldValue(latest?.updateTitle?.jsonValue?.value)?.trim();

  if (!latestTitle) {
    return null;
  }

  const status = parseUpdateItemStatus(toStringFieldValue(latest.updateStatus?.jsonValue?.value));

  return {
    title: latestTitle,
    message: toStringFieldValue(latest.updateMessage?.jsonValue?.value) ?? '',
    ...(status ? { status } : {}),
    dateTime: toStringFieldValue(latest.updateDateTime?.jsonValue?.value),
  };
}
