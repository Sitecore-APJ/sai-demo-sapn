import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as CustomerNotification } from '../components/customer-notification/CustomerNotification';
import { CommonParams, CommonRendering } from './common/commonData';
import { CustomerNotificationGQLFields } from '@/types/customer-notification';

const sampleMapText = `center: -34.9285, 138.6007, zoom: 12
Adelaide CBD | -34.9285, 138.6007 | active | 2026-06-09 | Power outage affecting 200 customers
North Adelaide | -34.9100, 138.5950 | planned | 2026-06-10 | Scheduled maintenance`;

const mockFields: CustomerNotificationGQLFields = {
  data: {
    datasource: {
      title: { jsonValue: { value: 'Adelaide CBD Planned Outage' } },
      outageLocation: { jsonValue: { value: 'Adelaide CBD and North Adelaide' } },
      outageDate: { jsonValue: { value: '2026-06-09T00:00:00Z' } },
      outageMap: { jsonValue: { value: sampleMapText } },
      banner: {
        jsonValue: {
          value: 'Planned maintenance will affect power supply in Adelaide CBD on 9 June.',
        },
      },
      children: {
        results: [
          {
            id: 'update-1',
            updateTitle: { jsonValue: { value: 'Initial outage reported' } },
            updateMessage: {
              jsonValue: {
                value: 'We are aware of an outage affecting Adelaide CBD.',
              },
            },
            updateDateTime: { jsonValue: { value: '2026-06-09T06:00:00Z' } },
            updateStatus: { jsonValue: { value: 'Resolved' } },
          },
          {
            id: 'update-2',
            updateTitle: { jsonValue: { value: 'Crews on site — restoration underway' } },
            updateMessage: {
              jsonValue: {
                value: 'Our crews are on site. Power is expected to be restored by 2:00 PM ACST.',
              },
            },
            updateDateTime: { jsonValue: { value: '2026-06-09T10:00:00Z' } },
            updateStatus: { jsonValue: { value: 'Active' } },
          },
        ],
      },
    },
  },
};

const meta = {
  title: 'Customer Notification/CustomerNotification',
  component: CustomerNotification,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomerNotification>;

export default meta;

type Story = StoryObj<typeof CustomerNotification>;

export const Default: Story = {
  args: {
    params: CommonParams,
    rendering: {
      ...CommonRendering,
      componentName: 'CustomerNotification',
    },
    fields: mockFields,
  },
};

export const FallbackBannerOnly: Story = {
  args: {
    params: CommonParams,
    rendering: {
      ...CommonRendering,
      componentName: 'CustomerNotification',
    },
    fields: {
      data: {
        datasource: {
          ...mockFields.data.datasource,
          children: { results: [] },
        },
      },
    },
  },
};
