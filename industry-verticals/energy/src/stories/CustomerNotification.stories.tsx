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
