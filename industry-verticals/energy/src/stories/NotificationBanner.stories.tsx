import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as NotificationBanner } from '../components/customer-notification/NotificationBanner';
import { CommonParams, CommonRendering } from './common/commonData';
import { NotificationBannerGQLFields } from '@/types/customer-notification';

const mockFields: NotificationBannerGQLFields = {
  data: {
    datasource: {
      banner: { jsonValue: { value: true } },
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
  title: 'Customer Notification/NotificationBanner',
  component: NotificationBanner,
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationBanner>;

export default meta;

type Story = StoryObj<typeof NotificationBanner>;

export const Default: Story = {
  args: {
    params: CommonParams,
    rendering: {
      ...CommonRendering,
      componentName: 'NotificationBanner',
    },
    fields: mockFields,
  },
};

export const BannerDisabled: Story = {
  args: {
    params: CommonParams,
    rendering: {
      ...CommonRendering,
      componentName: 'NotificationBanner',
    },
    fields: {
      data: {
        datasource: {
          ...mockFields.data.datasource!,
          banner: { jsonValue: { value: false } },
        },
      },
    },
  },
};
