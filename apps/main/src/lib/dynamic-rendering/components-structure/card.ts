export default {
  component: 'Card',
  props: {
    id: {
      propsType: 'string',
      default: ""
    },
    title: {
      propsType: 'string',
      default: 'Title'
    },
    headline: {
      propsType: 'string',
      default: 'Headline'
    },
    copy: {
      propsType: 'string',
      default: 'Copy'
    },
    items: {
      propsType: 'array',
      default: []
    },
    image: {
      url: {
        propsType: 'string',
        default: "http://"
      }
    }
  }
}
