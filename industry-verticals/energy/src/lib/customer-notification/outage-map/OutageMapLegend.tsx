import { OutageStatus } from '@/types/customer-notification';
import { OUTAGE_MARKER_COLORS, OUTAGE_STATUS_LABELS } from './outageMapMarkers';

interface OutageMapLegendProps {
  statuses: OutageStatus[];
}

/**
 * Displays a color-coded legend for outage pin statuses on the map.
 * @param {OutageMapLegendProps} props - Outage statuses present in the current map data
 * @returns {JSX.Element | null} The legend overlay, or null when no statuses are available
 */
export function OutageMapLegend({ statuses }: OutageMapLegendProps) {
  if (statuses.length === 0) {
    return null;
  }

  return (
    <div className="bg-background/95 border-border absolute bottom-3 left-3 z-10 rounded-md border p-3 shadow-sm">
      <p className="text-foreground-light mb-2 text-xs font-semibold tracking-wide uppercase">
        Legend
      </p>
      <ul className="space-y-1.5">
        {statuses.map((status) => (
          <li key={status} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: OUTAGE_MARKER_COLORS[status] }}
              aria-hidden
            />
            <span>{OUTAGE_STATUS_LABELS[status]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
