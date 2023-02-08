import type { ComponentStory, ComponentMeta } from '@storybook/react'
//import { Button } from '@acme/design-system'
import Quote from '.'
import '@vercel/examples-ui/globals.css'

export default {
  title: 'quote',
  component: Quote,
} as ComponentMeta<typeof Quote>

const Template: ComponentStory<typeof Quote> = (args) => <Quote {...args} />

export const Default = Template.bind({})
Default.args = { children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc egestas nisi, euismod aliquam nisl nunc euismod.' }