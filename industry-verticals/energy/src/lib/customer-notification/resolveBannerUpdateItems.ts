import { NotificationBannerGQLFields, UpdateItemGQL } from '@/types/customer-notification';

function hasUpdateItemFields(item: UpdateItemGQL | undefined): item is UpdateItemGQL {
  return Boolean(
    item?.id &&
    (item.updateTitle?.jsonValue?.value ||
      item.updateMessage?.jsonValue?.value ||
      item.updateStatus?.jsonValue?.value)
  );
}

function filterUpdateItems(items: UpdateItemGQL[] | undefined): UpdateItemGQL[] | undefined {
  const resolved = items?.filter(hasUpdateItemFields);

  return resolved && resolved.length > 0 ? resolved : undefined;
}

/** Resolves nested Update Item pages from the current page context item. */
export function resolveBannerUpdateItems(
  fields: NotificationBannerGQLFields | undefined
): UpdateItemGQL[] | undefined {
  return filterUpdateItems(fields?.data?.contextItem?.children?.results);
}
