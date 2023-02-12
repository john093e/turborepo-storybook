import { v4 as uuidv4 } from 'uuid';

export default {
  component: 'Container',
  props: {
    id: {
      propsType: 'string',
      default: ""
    },
    fluid: {
      propsType: 'boolean',
      default: true,
    },
    items: {
      propsType: 'array',
      default: []
    }
  }
}
