// import { useState, useEffect, useContext } from 'react';
// import { EditionContext } from '@contexts/app/specific/website/page-builder/layout';
// import { Components } from 'lib/dynamic-rendering/dynamic-rendering.constants';

// const SidebarAllComponents = () => {
//     const { components, setSidebarMode } = useContext(EditionContext);

//     const [allComponents, setAllComponents] = useState(Object.keys(Components));

//     const handleAddComponent = (name: string) => {
//     }

//     const [prevComponents, setPrevComponents] = useState(components);

//     useEffect(() => {
//         if (JSON.stringify(prevComponents) !== JSON.stringify(components)) setSidebarMode("edit");
//         setPrevComponents(components);
//     }, [components])

//     return (
//         <div>
//             <div className="text-lg font-medium">Add Component</div>
//             {allComponents.length ? (
//                 <div className="grid grid-cols-3 gap-2">
//                     {allComponents.map(component => {
//                         const Component = Components[component];
//                         if (!Component) return null; // check if the component has been loaded
//                         return (
//                             <div key={component} className="col-span-1 flex flex-col justify-center items-center border-solid border-2 border-gray-600 rounded-md">
//                                 <Component />
//                                 <div className="text-center font-medium text-gray-700">{component}</div>
//                                 <button onClick={() => handleAddComponent(component)}>Add</button>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <p className="text-lg font-medium">No components yet</p>
//             )}
//         </div>

//     );
// };
// export default SidebarAllComponents;




// import { useState, useEffect, useContext } from 'react';
// import { EditionContext } from '@contexts/app/specific/website/page-builder/layout';

// interface AllComponent {
//     id: string;
//     name: string;
//     icon: string;
// }

// const SidebarAllComponents = () => {
//     const { components, setComponents, setSidebarMode } = useContext(EditionContext);

//     const [allComponents, setAllComponents] = useState<AllComponent[]>([
//         { id: "1", name: "Text", icon: "uil-text" },
//         { id: "2", name: "Image", icon: "uil-image" },
//         { id: "3", name: "Video", icon: "uil-video" },
//     ]);

//     const handleAddComponent = (id: string) => {
//         if (id) {
//             const selected = allComponents.find(c => c.id === id);
//             if (selected) {
//                 // code to add a new component to the list
//                 const newComponents = [...components, selected];
//                 // use setComponents to update the state
//                 setComponents(newComponents);
//             }
//         }
//     }

//     const [prevComponents, setPrevComponents] = useState(components);

//     useEffect(() => {
//         if (JSON.stringify(prevComponents) !== JSON.stringify(components)) setSidebarMode("edit");
//         setPrevComponents(components);
//     }, [components])

//     // state variable to store the imported icons
//     const [loadedIcons, setLoadedIcons] = useState<{ [key: string]: any }>({});

//     useEffect(() => {
//         allComponents.forEach((component) => {
//             import(`@iconscout/react-unicons/icons/${component.icon}`).then(({ default: Icon }) => {
//                 setLoadedIcons((prevIcons) => ({ ...prevIcons, [component.icon]: Icon }));
//             });
//         });
//     }, [allComponents]);

//     return (
//         <div>
//             <div className="text-lg font-medium">Add Component</div>
//             {allComponents.length ? (
//                 <div className="grid grid-cols-3 gap-2">
//                     {allComponents.map(component => {
//                         const Icon = loadedIcons[component.icon];
//                         if (!Icon) return null; // check if the icon has been loaded
//                         return (
//                             <div key={component.id} className="col-span-1 flex flex-col justify-center items-center border-solid border-2 border-gray-600 rounded-md">
//                                 <Icon />
//                                 <div className="text-center font-medium text-gray-700">{component.name}</div>
//                                 <button onClick={() => handleAddComponent(component.id)}>Add</button>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <p className="text-lg font-medium">No components yet</p>
//             )}
//         </div>

//     );
// };
// export default SidebarAllComponents;









import React, {useState, useContext} from 'react';
import { Components } from '@lib/dynamic-rendering/dynamic-rendering.constants';
import { ComponentList, IComponent } from "@lib/dynamic-rendering/dynamic-rendering.interfaces";
// import componentsStructure from '@lib/dynamic-rendering/components-structure';
import { getComponentsData } from "@lib/dynamic-rendering/components-structure.get-components-props"

import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';

type Props = {};

const SidebarAllComponents: React.FC<Props> = () => {

    const { pageBody, setPageBody } = useContext(EditionContext);

    const allComponents = Object.values(Components);
    
    const handleAddComponent = (componentName: ComponentList) => {
        const newComponent = getComponentsData(componentName) as IComponent;
        // setPageBody([...pageBody, newComponent]);
        const updatedPageBody = { ...pageBody };
        updatedPageBody.data.items!.push(newComponent);
        setPageBody(updatedPageBody);
    };
return (
    <div>
        <div className="text-lg font-medium">Add Component</div>
        {allComponents.length ? (
            <div className="grid grid-cols-3 gap-2">
                {allComponents.map((oneComponent, index) => {
                    return (
                        <div key={index} className="col-span-1 flex flex-col justify-center items-center border-solid border-2 border-gray-600 rounded-md">
                            <div className="text-center font-medium text-gray-700">{oneComponent.name}</div>
                            <button onClick={() => handleAddComponent(oneComponent.name as ComponentList)}>Add</button>
                        </div>
                    );
                })}
            </div>
        ) : (
            <p className="text-lg font-medium">No components yet</p>
        )}
        {/* <pre>{JSON.stringify(allComponents, null, 2)}</pre>
        <pre>{JSON.stringify(Components, null, 2)}</pre>
        <pre>{JSON.stringify(pageBody, null, 2)}</pre> */}
    </div>

);

};
export default SidebarAllComponents;