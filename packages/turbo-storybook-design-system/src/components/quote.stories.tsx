import type { Meta, StoryObj } from '@storybook/react';
import {Quote} from './quote'

const meta = {
  title: 'InDesignSystemPackageWithTailwind/Quote',
  component: Quote,
  tags: ['autodocs']
} satisfies Meta<typeof Quote>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story =  {
  args: {
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc egestas nisi, euismod aliquam nisl nunc euismod.'
  },
} satisfies Story;