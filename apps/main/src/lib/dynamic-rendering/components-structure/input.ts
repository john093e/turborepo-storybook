import { v4 as uuidv4 } from 'uuid';

export default {
    component: 'Input',
    props: {
        id: {
            type: 'string',
            default: ""
        },
        label: {
            type: 'string',
            default: 'Label'
        },
        type: {
            type: 'string',
            default: "text"
        },
        placeholder: {
            type: 'string',
            default: "Text"
        },
        isRequired: {
            type: 'boolean',
            default: false
        },
        minCharactersAllowed: {
            type: 'number',
            default: 1
        },
        maxCharactersAllowed: {
            type: 'number',
            default: 100
        },
        validations: {
            regexType: {
                type: 'RegExp',
                default: ''
            },
            regexErrorCopy: {
                type: 'string',
                default: 'Invalid input'
            }
        }
    }
}