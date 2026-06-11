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

/**
 * Resolves nested Update Item pages from the same integrated GraphQL item used for the banner.
 * When a datasource item is present, only its children are used (no contextItem fallback).
 */
export function resolveBannerUpdateItems(
  fields: NotificationBannerGQLFields | undefined
): UpdateItemGQL[] | undefined {
  const gqlDatasource = fields?.data?.datasource;

  if (gqlDatasource) {
    return filterUpdateItems(gqlDatasource.children?.results);
  }

  return filterUpdateItems(fields?.data?.contextItem?.children?.results);
}
