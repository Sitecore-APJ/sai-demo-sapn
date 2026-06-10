/**
 * Returns whether a Sitecore Checkbox field value is enabled.
 * @param {boolean | string | number | undefined | null} value - Raw field value from GraphQL or layout
 * @returns {boolean} True when the checkbox is checked
 */
export function isCheckboxFieldEnabled(
  value: boolean | string | number | undefined | null
): boolean {
  if (value === true) {
    return true;
  }

  if (value === false || value === null || value === undefined) {
    return false;
  }

  return String(value) === '1';
}
