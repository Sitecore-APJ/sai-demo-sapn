import { OUTAGE_STATUS_STYLES } from '@/lib/customer-notification/outage-map/outageStatusStyles';
import { OUTAGE_CENTER_PIN_LEGEND_LABEL } from '@/lib/customer-notification/outage-map/outageMapMarkers';

/**
 * Legend for the multi-notification overview map showing all outage status colors.
 */
export function OverviewMapLegend() {
  const statuses = [
    OUTAGE_STATUS_STYLES.active,
    OUTAGE_STATUS_STYLES.planned,
    OUTAGE_STATUS_STYLES.restored,
  ];

  return (
    <div className="bg-background/95 border-border absolute bottom-3 left-3 z-10 rounded-md border p-3 shadow-sm">
      <p className="text-foreground-light mb-2 text-xs font-semibold tracking-wide uppercase">
        Legend
      </p>
      <ul className="space-y-2">
        {statuses.map((statusStyle) => (
          <li key={statusStyle.overlayLegendLabel} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-3 w-5 rounded-sm border border-white"
              style={{ backgroundColor: statusStyle.fillColor, opacity: 0.85 }}
              aria-hidden
            />
            <span>{statusStyle.overlayLegendLabel}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-xs">
          <span
            className="relative inline-block h-4 w-4"
            style={{ transform: 'rotate(-45deg)' }}
            aria-hidden
          >
            <span className="bg-danger border-danger absolute inset-0 rounded-full rounded-br-none border-2" />
          </span>
          <span>{OUTAGE_CENTER_PIN_LEGEND_LABEL}</span>
        </li>
      </ul>
    </div>
  );
}
