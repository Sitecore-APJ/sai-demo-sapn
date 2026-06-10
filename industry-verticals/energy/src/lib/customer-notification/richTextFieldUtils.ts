import { isFieldValueEmpty } from '@sitecore-content-sdk/core/layout';
import { RichTextField } from '@sitecore-content-sdk/nextjs';

/**
 * Returns whether a RichText field contains authored content.
 * @param {RichTextField | undefined} field - Sitecore rich text field
 * @returns {boolean} True when the field has non-empty content
 */
export function hasRichTextContent(field: RichTextField | undefined): boolean {
  return !isFieldValueEmpty(field);
}

/**
 * Extracts plain text from a RichText field for non-rendering use cases.
 * @param {RichTextField | undefined} field - Sitecore rich text field
 * @returns {string} Plain text with HTML removed, or an empty string
 */
export function getRichTextPlainText(field: RichTextField | undefined): string {
  if (isFieldValueEmpty(field)) {
    return '';
  }

  const html = typeof field?.value === 'string' ? field.value : '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
