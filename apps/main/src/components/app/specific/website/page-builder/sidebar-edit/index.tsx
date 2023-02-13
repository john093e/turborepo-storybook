import { useContext } from 'react';
import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';
import { LayoutContext } from '@contexts/app/specific/website/page-builder/layout';

import SidebarTopMenu from './sidebar-top-menu';
import SidebarScheme from './sidebar-scheme';
import SidebarAllComponents from './sidebar-all-components';
import SidebarEditComponents from './sidebar-edit-components';


const Sidebar = () => {
    const { sidebarMode } = useContext( EditionContext );
    const {
        showPreview
    } = useContext(LayoutContext);

    return (
        <div className={`bg-gray-50 h-full min-w-[24em] duration-300 right-0 border-l-[1px] border-solid border-gray-300 ${!showPreview ? "w-full" : "w-[24em]"}`}>
            <SidebarTopMenu />
            {sidebarMode === 'scheme' && (
                <SidebarScheme />
            )}
            {sidebarMode === 'components' && (
                <SidebarAllComponents />
            )}
            {sidebarMode === 'edit' && (
                <SidebarEditComponents />
            )}

        </div>
    );
};
export default Sidebar;