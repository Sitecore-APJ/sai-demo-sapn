import { ImageField } from '@sitecore-content-sdk/nextjs';
import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';

/**
 * Returns whether an outage map image has been uploaded.
 * @param {ImageField | undefined} field - Sitecore image field
 * @returns {boolean} True when the field contains an image source
 */
export function hasOutageMapImage(field: ImageField | undefined): boolean {
  return !isFieldValueEmpty(field) && Boolean(field?.value?.src);
}
