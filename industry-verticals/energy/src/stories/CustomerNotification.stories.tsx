import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as CustomerNotification } from '../components/customer-notification/CustomerNotification';
import { CommonParams, CommonRendering } from './common/commonData';
import { CustomerNotificationPageFields } from '@/types/customer-notification';
import { createRichTextField, createTextField } from './helpers/createFields';

const mockFields: CustomerNotificationPageFields = {
  Title: createTextField('Adelaide CBD Planned Outage', 1),
  Location: createTextField('Adelaide CBD and North Adelaide', 1),
  OutageDate: { value: '2026-06-09T00:00:00Z' },
  OutageSummary: createTextField(
    'Planned outage affecting approximately 200 customers in Adelaide CBD',
    1
  ),
  OutageDescription: createRichTextField(2),
  OutageStatus: { value: 'Planned' },
  OutageMap: { value: {} },
  Banner: { value: true },
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
