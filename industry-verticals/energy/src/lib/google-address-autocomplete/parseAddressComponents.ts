export type ParsedAddress = {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShortName = false
): string {
  const component = components.find((entry) => entry.types.includes(type));

  if (!component) {
    return '';
  }

  return useShortName ? component.short_name : component.long_name;
}

/**
 * Maps Google Places address_components to form field values.
 */
export function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[] | undefined
): ParsedAddress {
  if (!components?.length) {
    return {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    };
  }

  const streetNumber = getComponent(components, 'street_number');
  const route = getComponent(components, 'route');
  const streetAddress = [streetNumber, route].filter(Boolean).join(' ').trim();
  const city = getComponent(components, 'locality') || getComponent(components, 'postal_town');
  const state = getComponent(components, 'administrative_area_level_1', true);
  const postalCode = getComponent(components, 'postal_code');
  const country = getComponent(components, 'country', true);

  return {
    streetAddress,
    city,
    state,
    postalCode,
    country,
  };
}
