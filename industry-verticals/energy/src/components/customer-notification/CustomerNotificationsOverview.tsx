'use client';

import { ComponentProps } from '@/lib/component-props';
import { NotificationsOverviewMap } from '@/lib/customer-notification/notifications-overview/NotificationsOverviewMap';
import {
  filterActiveNotifications,
  filterArchivedNotifications,
  resolveCustomerNotificationPages,
} from '@/lib/customer-notification/resolveCustomerNotificationPages';
import { CustomerNotificationsOverviewGQLFields } from '@/types/customer-notification';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { useMemo, useState } from 'react';
import { NotificationList } from './NotificationList';

type OverviewTab = 'active' | 'archived';

interface CustomerNotificationsOverviewProps extends ComponentProps {
  fields: CustomerNotificationsOverviewGQLFields;
}

function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-accent text-foreground' : 'text-foreground-light hover:bg-background-muted'
      }`}
      aria-pressed={active}
    >
      {label} ({count})
    </button>
  );
}

/**
 * Overview for the Customer Notifications root page with active map/list and archived list tabs.
 */
export const Default = ({ params, fields }: CustomerNotificationsOverviewProps) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { styles, RenderingIdentifier: id } = params;
  const [activeTab, setActiveTab] = useState<OverviewTab>('active');

  const notifications = useMemo(
    () => resolveCustomerNotificationPages(fields?.data?.contextItem?.children?.results),
    [fields]
  );

  const activeNotifications = useMemo(
    () => filterActiveNotifications(notifications),
    [notifications]
  );
  const archivedNotifications = useMemo(
    () => filterArchivedNotifications(notifications),
    [notifications]
  );

  return (
    <div className={`customer-notifications-overview w-full ${styles ?? ''}`} id={id}>
      <div className="container space-y-6 py-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Customer Notifications</h1>
          <p className="text-foreground-light text-base">
            View active outage notifications on the map or browse archived notifications.
          </p>
        </header>

        <div className="bg-background-accent inline-flex gap-1 rounded-lg p-1" role="tablist">
          <TabButton
            active={activeTab === 'active'}
            label="Active"
            count={activeNotifications.length}
            onClick={() => setActiveTab('active')}
          />
          <TabButton
            active={activeTab === 'archived'}
            label="Archived"
            count={archivedNotifications.length}
            onClick={() => setActiveTab('archived')}
          />
        </div>

        {activeTab === 'active' ? (
          <div className="space-y-6">
            <section aria-label="Active notifications map" className="space-y-3">
              <h2 className="text-xl font-semibold">Active notifications map</h2>
              <NotificationsOverviewMap notifications={activeNotifications} />
            </section>

            <section aria-label="Active notifications list" className="space-y-3">
              <h2 className="text-xl font-semibold">Active notifications</h2>
              <NotificationList
                notifications={activeNotifications}
                emptyMessage="No active customer notifications. Create a notification page with an Outage Status other than Archived."
              />
            </section>
          </div>
        ) : (
          <section aria-label="Archived notifications list" className="space-y-3">
            <h2 className="text-xl font-semibold">Archived notifications</h2>
            <NotificationList
              notifications={archivedNotifications}
              emptyMessage="No archived customer notifications. Set Outage Status to Archived on a notification page to move it here."
            />
          </section>
        )}

        {isPageEditing && notifications.length === 0 && (
          <p className="text-foreground-light text-sm">
            Add Customer Notification pages as children of this page to populate the overview.
          </p>
        )}
      </div>
    </div>
  );
};
