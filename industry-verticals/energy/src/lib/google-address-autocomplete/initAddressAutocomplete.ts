import { getPlacesCountryRestriction, loadGooglePlaces } from './loadGooglePlaces';
import { parseAddressComponents } from './parseAddressComponents';

const INIT_ATTR = 'data-google-address-init';

const BREAKDOWN_FIELD_SELECTORS = [
  'input[autocomplete="address-level2"]',
  'input[autocomplete="address-level1"]',
  'input[autocomplete="postal-code"]',
  'input[autocomplete="country"]',
  'input[autocomplete="address-line1"]',
];

const STREET_FIELD_SELECTORS = ['street-address', 'address-line1'];

type AutocompleteBinding = {
  input: HTMLInputElement;
  listener: google.maps.MapsEventListener;
};

function setInputValue(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function getFormContainer(input: HTMLInputElement): ParentNode {
  return input.closest('form') ?? input.parentElement ?? document.body;
}

function hasBreakdownFields(container: ParentNode, streetInput: HTMLInputElement): boolean {
  return BREAKDOWN_FIELD_SELECTORS.some((selector) => {
    const field = container.querySelector(selector);

    return field instanceof HTMLInputElement && field !== streetInput;
  });
}

function fillField(container: ParentNode, autocomplete: string, value: string | undefined) {
  if (!value) {
    return;
  }

  const input = container.querySelector<HTMLInputElement>(`input[autocomplete="${autocomplete}"]`);

  if (input) {
    setInputValue(input, value);
  }
}

function fillSplitAddressFields(container: ParentNode, place: google.maps.places.PlaceResult) {
  const parsed = parseAddressComponents(place.address_components);
  const streetValue = parsed.streetAddress || place.formatted_address || '';

  for (const autocomplete of STREET_FIELD_SELECTORS) {
    const input = container.querySelector<HTMLInputElement>(
      `input[autocomplete="${autocomplete}"]`
    );

    if (input) {
      setInputValue(input, streetValue);
      break;
    }
  }

  fillField(container, 'address-level2', parsed.city);
  fillField(container, 'address-level1', parsed.state);
  fillField(container, 'postal-code', parsed.postalCode);
  fillField(container, 'country', parsed.country);
}

function handlePlaceChanged(
  streetInput: HTMLInputElement,
  autocomplete: google.maps.places.Autocomplete
) {
  const place = autocomplete.getPlace();
  const container = getFormContainer(streetInput);

  if (!place.formatted_address && !place.address_components?.length) {
    return;
  }

  if (hasBreakdownFields(container, streetInput)) {
    fillSplitAddressFields(container, place);
    return;
  }

  setInputValue(streetInput, place.formatted_address ?? '');
}

function isEligibleStreetInput(input: HTMLInputElement): boolean {
  if (input.getAttribute(INIT_ATTR) === 'true') {
    return false;
  }

  if (input.disabled || input.readOnly) {
    return false;
  }

  return input.autocomplete === 'street-address';
}

/**
 * Scans the DOM for street-address inputs and attaches Google Places Autocomplete.
 * Returns a teardown function for observers and listeners.
 */
export async function initAddressAutocomplete(): Promise<() => void> {
  await loadGooglePlaces();

  const country = getPlacesCountryRestriction();
  const bindings: AutocompleteBinding[] = [];
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const bindInput = (input: HTMLInputElement) => {
    if (!isEligibleStreetInput(input)) {
      return;
    }

    const options: google.maps.places.AutocompleteOptions = {
      types: ['address'],
      fields: ['address_components', 'formatted_address'],
    };

    if (country) {
      options.componentRestrictions = { country };
    }

    const autocomplete = new google.maps.places.Autocomplete(input, options);
    const listener = autocomplete.addListener('place_changed', () => {
      handlePlaceChanged(input, autocomplete);
    });

    input.setAttribute(INIT_ATTR, 'true');
    bindings.push({ input, listener });
  };

  const scan = () => {
    document
      .querySelectorAll<HTMLInputElement>('input[autocomplete="street-address"]')
      .forEach(bindInput);
  };

  const scheduleScan = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      scan();
    }, 100);
  };

  scan();

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    observer.disconnect();

    for (const binding of bindings) {
      google.maps.event.removeListener(binding.listener);
      binding.input.removeAttribute(INIT_ATTR);
    }
  };
}
