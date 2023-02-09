import type { Meta, StoryObj } from '@storybook/react';
//import { Button } from '@acme/design-system'
import Button from '.'
import '@vercel/examples-ui/globals.css'

// export default {
//   title: 'button',
//   component: Button,
// } as Meta<typeof Button>

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story =  {
  args: {
    children: 'This is a button !'
  },
} satisfies Story;

export const Secondary : Story = {
  args: {
    children: 'This is a button !',
    secondary: true 
  },
} satisfies Story;

// const Template: StoryObj<typeof Button> = (args) => <Button {...args} />

// export const Primary = Template.bind({})
// Primary.args = { children: 'This is a button !' }

// export const Secondary = Template.bind({})
// Secondary.args = { children: 'This is a button !', secondary: true }