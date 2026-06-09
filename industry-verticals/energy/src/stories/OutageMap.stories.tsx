import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OutageMap } from '@/lib/customer-notification/outage-map/OutageMap';
import { parseOutageMapField } from '@/lib/customer-notification/parseOutageMapField';

const sampleMapText = `center: -34.9285, 138.6007, zoom: 12
Adelaide CBD | -34.9285, 138.6007 | active | 2026-06-09 | Power outage affecting 200 customers
North Adelaide | -34.9100, 138.5950 | planned | 2026-06-10 | Scheduled maintenance
Glenelg | -34.9800, 138.5200 | restored | 2026-06-08 | Power restored`;

const parsed = parseOutageMapField(sampleMapText);

const meta = {
  title: 'Customer Notification/OutageMap',
  component: OutageMap,
  tags: ['autodocs'],
} satisfies Meta<typeof OutageMap>;

export default meta;

type Story = StoryObj<typeof OutageMap>;

export const Default: Story = {
  args: {
    data: parsed.data,
    parseErrors: parsed.errors,
  },
};

export const Empty: Story = {
  args: {
    data: null,
    parseErrors: [],
  },
};

export const ParseError: Story = {
  args: {
    data: null,
    parseErrors: ['Line 2: invalid status "unknown" (use active, planned, or restored)'],
  },
};
