export type ComponentList =
    | 'Button'
    | 'Card'
    | 'Container'
    | 'Divider'
    | 'Input';

export interface IComponent {
    component: ComponentList;
    data: {
        id: string;
        embeddedView?: IComponent;
        items?: Array<IComponent>;
        [key: string]: unknown;
    };
}
