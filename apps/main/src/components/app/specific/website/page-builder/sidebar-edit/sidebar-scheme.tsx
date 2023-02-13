import { useContext, useEffect, useState } from 'react';
import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';
import {
    Dropdown,
} from "flowbite-react";

const ComponentButtons = ({ component, index }: { component: { id: string; name: string; icon: string }, index: number }) => {
    const { setSelectedComponentId, moveComponent, deleteComponent } = useContext(EditionContext);

    return (
        <Dropdown inline={true} arrowIcon={false} label={(<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>)}>
            <Dropdown.Item onClick={() => setSelectedComponentId(component.id)}
            >
                Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => moveComponent(index, 'up')}
            >
                Move Up
            </Dropdown.Item>
            <Dropdown.Item onClick={() => moveComponent(index, 'down')}
            >
                Move Down
            </Dropdown.Item>
            <Dropdown.Item onClick={() => deleteComponent(index)}
            >
                Delete
            </Dropdown.Item>
        </Dropdown>
    );
}


const SidebarScheme = () => {
    const { components, setSidebarMode } = useContext(EditionContext);

    // state variable to store the imported icons
    const [loadedIcons, setLoadedIcons] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        components.forEach((component) => {
            import(`@iconscout/react-unicons/icons/${component.icon}`).then(({ default: Icon }) => {
                setLoadedIcons((prevIcons) => ({ ...prevIcons, [component.icon]: Icon }));
            });
        });
    }, [components]);

    return (
        <div className='p-5'>
            <p className="text-lg font-medium">Scheme of the page</p>
            {components.length ? (
                <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {components.map((component, index) => {
                        const Icon = loadedIcons[component.icon];
                        if (!Icon) return null; // check if the icon has been loaded
                        return (
                            <li className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white" key={index} >
                                <Icon className="w-4 h-4 mr-2" />
                                <div className="flex flex-row items-center w-full justify-between">
                                    <div>
                                        <p className="text-lg font-medium">{component.name}</p>
                                    </div>
                                    <ComponentButtons component={component} index={index} />
                                </div>
                            </li>
                        )
                    }
                    )}
                </ul>
            ) : (
                <p className="text-lg font-medium">No components yet</p>
            )}
            <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" onClick={() => setSidebarMode("components")}>Add Component</button>
        </div>
    );
};
export default SidebarScheme;