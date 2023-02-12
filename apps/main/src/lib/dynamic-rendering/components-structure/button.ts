export default {
  component: 'Button',
  props: {
    id: {
      propsType: 'string',
      default: ""
    },
    title: {
      propsType: 'string',
      default: "Button example"
    },
    className: {
      propsType: 'string',
      default: 'btn-primary'
    },
    action: {
      type: {
        propsType: 'string',
        default: "call"
      },
      url: {
        propsType: 'string',
        default: "http://"
      }
    },
  }
}
