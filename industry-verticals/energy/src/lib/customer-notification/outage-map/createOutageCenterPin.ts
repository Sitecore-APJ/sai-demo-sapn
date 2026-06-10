/**
 * Creates a large outage-themed map pin element for AdvancedMarkerElement content.
 * @param {string} label - Suburb or location label for accessibility
 * @param {string} pinColor - Pin fill color
 * @param {string} pinBorderColor - Pin border color
 * @returns {HTMLElement} DOM element used as marker content
 */
export function createOutageCenterPin(
  label: string,
  pinColor: string,
  pinBorderColor: string
): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText =
    'display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);pointer-events:auto;';
  container.setAttribute('aria-label', `Outage location: ${label}`);

  const pin = document.createElement('div');
  pin.style.cssText = [
    'position:relative',
    'width:52px',
    'height:52px',
    `background:${pinColor}`,
    `border:4px solid ${pinBorderColor}`,
    'border-radius:50% 50% 50% 0',
    'transform:rotate(-45deg)',
    'box-shadow:0 6px 16px rgba(0,0,0,0.35)',
    'display:flex',
    'align-items:center',
    'justify-content:center',
  ].join(';');

  pin.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="width:26px;height:26px;transform:rotate(45deg);"
      aria-hidden="true"
    >
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  `;

  container.appendChild(pin);
  return container;
}
