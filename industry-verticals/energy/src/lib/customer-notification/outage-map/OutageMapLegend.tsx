import { OutageStatusStyle } from '@/lib/customer-notification/outage-map/outageStatusStyles';
import { OUTAGE_CENTER_PIN_LEGEND_LABEL } from '@/lib/customer-notification/outage-map/outageMapMarkers';

interface OutageMapLegendProps {
  statusStyle: OutageStatusStyle;
}

/**
 * Displays a legend for the status-colored impacted-area overlay and outage center pin.
 * @param {OutageMapLegendProps} props - Status-specific colors and labels
 * @returns {JSX.Element} The map legend overlay
 */
export function OutageMapLegend({ statusStyle }: OutageMapLegendProps) {
  return (
    <div className="bg-background/95 border-border absolute bottom-3 left-3 z-10 rounded-md border p-3 shadow-sm">
      <p className="text-foreground-light mb-2 text-xs font-semibold tracking-wide uppercase">
        Legend
      </p>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-3 w-5 rounded-sm border border-white"
            style={{ backgroundColor: statusStyle.fillColor, opacity: 0.85 }}
            aria-hidden
          />
          <span>{statusStyle.overlayLegendLabel}</span>
        </li>
        <li className="flex items-center gap-2 text-xs">
          <span
            className="relative inline-block h-4 w-4"
            style={{ transform: 'rotate(-45deg)' }}
            aria-hidden
          >
            <span
              className="absolute inset-0 rounded-full rounded-br-none border-2"
              style={{
                backgroundColor: statusStyle.pinColor,
                borderColor: statusStyle.pinBorderColor,
              }}
            />
          </span>
          <span>{OUTAGE_CENTER_PIN_LEGEND_LABEL}</span>
        </li>
      </ul>
    </div>
  );
}
