import { useContext } from 'react';
import { LayoutContext } from '@contexts/app/specific/website/page-builder/layout';
import MainMenu from '@components/app/specific/website/page-builder/main-menu';
import SidebarEdit from '@components/app/specific/website/page-builder/sidebar-edit/';
import SidebarPages from '@components/app/specific/website/page-builder/sidebar-pages/';
import Preview from '@components/app/specific/website/page-builder/preview/';



const PageBuilder = () => {

    const {
        showSidebarPages,
        showPreview,
        showSideBar,
    } = useContext(LayoutContext);

    return (
        <div className="h-screen relative flex flex-col">
            <MainMenu />
            <div className={`h-full relative flex ${showPreview || showSidebarPages ? "justify-between" : "justify-end"}`}>
                {showSidebarPages && <SidebarPages />}
                {showPreview && <Preview />}
                {showSideBar && <SidebarEdit />}
            </div>
        </div>
    );
};

export default PageBuilder;


// const data = {
//     "story": {
//         "name": "demo",
//         "created_at": "2019-08-22T10:23:59.986Z",
//         "published_at": "2019-08-22T10:24:27.898Z",
//         "alternates": [],
//         "id": 2069783,
//         "uuid": "728a2780-f3bc-49a5-9d95-bcfd0caf7fda",
//         "content": {
//             "_uid": "31b755c7-a585-42f6-97f4-beadd42d7ae8",
//             "body": [
//                 {
//                     "_uid": "15c5e83a-69d5-4bd0-85c8-d8e5df7c9a66",
//                     "headline": "Foo",
//                     "component": "foo"
//                 },
//                 {
//                     "_uid": "ff225b73-b136-4bb8-87c7-beaf5a15fc0d",
//                     "title": "Bar",
//                     "component": "bar"
//                 },
//                 {
//                     "_uid": "67e57f81-87c1-4bd6-b17b-eccc4142d8d6",
//                     "headline": "Another headline",
//                     "component": "foo"
//                 }
//             ],
//             "component": "page"
//         },
//         "slug": "demo",
//         "full_slug": "demo",
//         "default_full_slug": null,
//         "sort_by_date": null,
//         "position": -483300,
//         "tag_list": [],
//         "is_startpage": false,
//         "parent_id": 0,
//         "meta_data": null,
//         "group_id": "42c4e57a-44b3-4886-befb-85ff1868c4e7",
//         "first_published_at": "2019-08-22T10:24:27.898Z",
//         "release_id": null,
//         "lang": "default",
//         "path": null,
//         "translated_slugs": []
//     }
// };