import { v4 as uuidv4 } from 'uuid';

export default {
  component: 'Divider',
  props: {
    id: {
      propsType: 'string',
      default: ""
    },
    marginY: {
      propsType: 'number',
      default: 2,
    },
    marginX: {
      propsType: 'number',
      default: 2,
    }
  }
}
