import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OutageMap } from '@/lib/customer-notification/outage-map/OutageMap';
import { createImageField } from './helpers/createFields';

const meta = {
  title: 'Customer Notification/OutageMap',
  component: OutageMap,
  tags: ['autodocs'],
} satisfies Meta<typeof OutageMap>;

export default meta;

type Story = StoryObj<typeof OutageMap>;

export const LocationOverlay: Story = {
  args: {
    locationQuery: 'Adelaide CBD and North Adelaide',
    outageStatus: 'Active',
    mapImage: { value: {} },
  },
};

export const PlannedOutage: Story = {
  args: {
    locationQuery: 'Adelaide CBD and North Adelaide',
    outageStatus: 'Planned',
    mapImage: { value: {} },
  },
};

export const UploadedImage: Story = {
  args: {
    locationQuery: 'Adelaide CBD',
    outageStatus: 'Active',
    mapImage: createImageField('placeholder'),
  },
};

export const Empty: Story = {
  args: {
    locationQuery: null,
    mapImage: { value: {} },
  },
};
