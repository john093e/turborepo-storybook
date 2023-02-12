import componentsStructure from '@lib/dynamic-rendering/components-structure';
import { ComponentList, IComponent } from './dynamic-rendering.interfaces';
import { v4 as uuidv4 } from 'uuid';

export function getComponentsData(componentName: ComponentList): IComponent | null {
    if (!componentName) return null;


    function returnChildProps(propsList: any | null) : any | null{
        if (!propsList) return null;
        const dataChild: any = {};

        for (const childProp in propsList) {
            if(propsList[childProp].hasOwnProperty('default')){  
                dataChild[childProp] = propsList[childProp].default;
            }else{
                const childData = returnChildProps(propsList[childProp]);
                if (childData) {
                    dataChild[childProp] = childData;
                }
            }
        }
        return dataChild
    }



    function getComponentData(item: ComponentList): IComponent {
        const componentStructure = componentsStructure[item];
        const data: any = {};
        for (const prop in componentStructure.props) {
            if(prop === "id"){
                data[prop] = uuidv4();
            }else{
                if(componentStructure.props[prop].hasOwnProperty('default')){  
                    data[prop] = componentStructure.props[prop].default; 
                }else{                             
                    data[prop] = returnChildProps(componentStructure.props[prop]);
                }
            }
        }

        return {
            component: item,
            data
        };
    }

    return getComponentData(componentName);
}