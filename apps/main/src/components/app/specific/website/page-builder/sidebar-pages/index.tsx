import { useContext } from 'react';
import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';
import SidebarTopMenu from './sidebar-top-menu';
import SidebarScheme from './sidebar-scheme';

const Sidebar = () => {
    const { sidebarMode } = useContext( EditionContext );

    return (
        <div className="bg-gray-50 h-full w-[24em] min-w-[24em] duration-300 border-solid border-r-[1px] border-gray-300">
            <SidebarTopMenu />
            <SidebarScheme />
        </div>
    );
};
export default Sidebar;