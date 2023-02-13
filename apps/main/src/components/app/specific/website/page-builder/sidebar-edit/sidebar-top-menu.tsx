import { useContext } from 'react';
import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';
import {
    Button,
  } from "flowbite-react";

const SidebarTopMenu = () => {
    const { selectedComponentId, sidebarMode, setSidebarMode } = useContext(
        EditionContext
    );

    return (
        <div className="p-5 bg-gray-200">
            {/* Example of displaying the current selected component ID */}
            <div className="text-sm font-medium">Selected Component ID: {selectedComponentId}</div>
            {/* Example of displaying the current sidebar mode */}
            <div className="text-sm font-medium">Sidebar Mode: {sidebarMode}</div>
            {/* Example of button to switch edit and scheme mode */}
            <Button.Group>
                <Button color="gray" onClick={() => setSidebarMode('edit')}>
                    Edit
                </Button>
                <Button color="gray" onClick={() => setSidebarMode('scheme')}>
                    Scheme
                </Button>
            </Button.Group>
        </div>
    );
};
export default SidebarTopMenu;