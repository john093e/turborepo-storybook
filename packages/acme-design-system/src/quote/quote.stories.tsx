import type { Meta, StoryObj } from '@storybook/react';
//import { Button } from '@acme/design-system'
import Quote from '.'
import '@vercel/examples-ui/globals.css'

// export default {
//   title: 'quote',
//   component: Quote,
// } as Meta<typeof Quote>

// const Template: StoryObj<typeof Quote> = (args) => <Quote {...args} />

// export const Default = Template.bind({})
// Default.args = { children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc egestas nisi, euismod aliquam nisl nunc euismod.' }

const meta = {
  component: Quote,
} satisfies Meta<typeof Quote>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story =  {
  args: {
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc egestas nisi, euismod aliquam nisl nunc euismod.'
  },
} satisfies Story;