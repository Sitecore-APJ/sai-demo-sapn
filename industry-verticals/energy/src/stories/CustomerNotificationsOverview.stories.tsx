import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as CustomerNotificationsOverview } from '../components/customer-notification/CustomerNotificationsOverview';
import { CommonParams, CommonRendering } from './common/commonData';
import { CustomerNotificationsOverviewGQLFields } from '@/types/customer-notification';

const mockFields: CustomerNotificationsOverviewGQLFields = {
  data: {
    contextItem: {
      children: {
        results: [
          {
            id: 'notification-1',
            url: { path: '/customer-notifications/adelaide-cbd-planned-outage' },
            title: { jsonValue: { value: 'Adelaide CBD Planned Outage' } },
            location: { jsonValue: { value: 'Adelaide CBD and North Adelaide' } },
            outageDate: { jsonValue: { value: '2026-06-09T00:00:00Z' } },
            outageSummary: {
              jsonValue: {
                value: 'Planned outage affecting approximately 200 customers in Adelaide CBD',
              },
            },
            outageStatus: { jsonValue: { value: 'Planned' } },
            notificationStatus: { jsonValue: { value: 'Active' } },
          },
          {
            id: 'notification-2',
            url: { path: '/customer-notifications/north-adelaide-restored-outage' },
            title: { jsonValue: { value: 'North Adelaide Restored Outage' } },
            location: { jsonValue: { value: 'North Adelaide' } },
            outageDate: { jsonValue: { value: '2026-05-20T00:00:00Z' } },
            outageSummary: {
              jsonValue: { value: 'Archived outage notification for North Adelaide.' },
            },
            outageStatus: { jsonValue: { value: 'Restored' } },
            notificationStatus: { jsonValue: { value: 'Archived' } },
          },
        ],
      },
    },
  },
};

const meta = {
  title: 'Customer Notification/CustomerNotificationsOverview',
  component: CustomerNotificationsOverview,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomerNotificationsOverview>;

export default meta;

type Story = StoryObj<typeof CustomerNotificationsOverview>;

export const Default: Story = {
  args: {
    params: CommonParams,
    rendering: {
      ...CommonRendering,
      componentName: 'CustomerNotificationsOverview',
    },
    fields: mockFields,
  },
};
