import { useContext } from 'react';
import { LayoutContext } from '@contexts/app/specific/website/page-builder/layout';
import Image from 'next/image';

import {
    UilArrowLeft,
    UilAngleDown,
    UilWebGrid,
    UilWindowGrid,
    UilBorderRight,
    UilFocusTarget,
    UilConstructor,
    UilEllipsisH,
    UilDesktop,
    UilTablet,
    UilMobileAndroidAlt,
    UilSun,
    UilMoon,
    UilEnglishToChinese
} from '@iconscout/react-unicons'

import {
    Button,
    Dropdown,
} from "flowbite-react";

const MainMenu = () => {
    const {
        theme, setTheme,
        showSidebarPages, setShowSidebarPages,
        showPreview, setShowPreview,
        previewSize, setPreviewSize,
        showSideBar, setShowSideBar,
    } = useContext(LayoutContext);
    return (
        <header className='flex w-full relative flex-col'>
            <nav className="bg-gray-800 border-gray-200 px-4 lg:px-6 py-1.5 dark:bg-gray-800 w-full relative">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <Button
                            color={"dark"}
                            size="xs"
                        >
                            <UilArrowLeft className="w-6 h-6 text-gray-200" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="flex mx-3 relative text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                            <span className="sr-only">Users</span>
                            <Image className="w-6 h-6 rounded-full" width={100} height={100} src="/static/default-profile.jpg" alt="user photo" />
                        </button>
                        {/* <!-- translate --> */}
                        <Button
                            color={"dark"}
                            size="xs"

                        >
                            <div
                                className='gap-2 flex items-center justify-center'
                            >
                                <UilEnglishToChinese className="w-4 h-4 text-gray-100" /> Default
                            </div>
                        </Button>
                        {/* <!-- preview --> */}
                        <div className='flex gap-2'>
                            <span className="inline-flex items-center text-gray-200 text-xs font-normal mr-2">
                                Preview
                            </span>
                        </div>
                        {/* <!-- saving statut --> */}
                        <div className='flex gap-2'>
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                Save
                            </span>
                        </div>
                        {/* <!-- button publish --> */}
                        <Button.Group>
                            <Button color={"gray"} size={"xs"}>
                                Publish
                            </Button>
                            <Button color="gray" size={"xs"}>
                                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                                </svg>
                            </Button>
                        </Button.Group>

                    </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700 flex flex-wrap items-center mx-auto w-full relative border-solid border-b-[1px] border-gray-300">

                <div className="px-4 py-3 md:px-6 flex flex-row w-3/12 gap-2">
                    <div className="flex justify-start items-center">
                        <Button
                            color={"transparent"}
                            size="xs"
                            onClick={() => setShowSidebarPages(!showSidebarPages)}
                        >
                            <UilAngleDown className={`w-5 h-5 text-gray-900 dark:text-white duration-100 ${showSidebarPages ? "-rotate-180" : "rotate-0"}`} />
                        </Button>
                    </div>
                    <div>
                        <span className='flex text-sm font-medium text-gray-900 dark:text-white'>Page name</span>
                        <span className='flex text-xs text-gray-900 dark:text-white'>page type</span>
                    </div>
                </div>
                <div className="px-4 py-3 md:px-6 flex w-6/12 justify-center">
                    <ul className="flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline">Company</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline">Team</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-900 dark:text-white hover:underline">Features</a>
                        </li>
                    </ul>
                </div>
                <div className="px-4 py-3 md:px-6 flex w-3/12">
                    <div className="flex w-full items-center justify-end gap-1">
                        {/* <!-- preview show / hide --> */}
                        <Button
                            color={"light"}
                            size="xs"
                            onClick={() => {
                                setShowPreview(!showPreview);
                            }}
                        >
                            {showPreview ? <UilFocusTarget className="w-6 h-6 text-gray-600" /> : <UilConstructor className="w-6 h-6 text-gray-600" />}

                        </Button>
                        {/*  preview size mode */}
                        {!showPreview ?
                            <Button
                                color={"light"}
                                size="xs"
                                disabled={!showPreview}
                            >
                                {previewSize === 'desktop' ? <UilDesktop className="w-6 h-6 text-gray-600" /> : previewSize === 'tablet' ? <UilTablet className="w-6 h-6 text-gray-600" /> : <UilMobileAndroidAlt className="w-6 h-6 text-gray-600" />}
                            </Button>
                            :
                            <Dropdown
                                arrowIcon={false}
                                inline={true}
                                label={<span className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-blue-300 disabled:hover:bg-white dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 focus:!ring-2 group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg">
                                <span className="flex items-center rounded-md text-xs px-2 py-1" >
                                    {previewSize === 'desktop' ? <UilDesktop className="w-6 h-6 text-gray-600" /> : previewSize === 'tablet' ? <UilTablet className="w-6 h-6 text-gray-600" /> : <UilMobileAndroidAlt className="w-6 h-6 text-gray-600" />}
                                </span></span>}
                                className="font-normal rounded-none w-40 !top-[3.75em]"
                            >
                                <Dropdown.Header>
                                    <p className='text-sm font-medium'>Responsive View</p>
                                </Dropdown.Header>
                                <Dropdown.Item
                                    className="flex items-center text-sm text-gray-700 gap-2"
                                    onClick={() => setPreviewSize("desktop")}
                                >
                                    <UilDesktop className="w-6 h-6 text-gray-600" /> <span className='grow-1 flex w-full'>Desktop</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="flex items-center text-sm text-gray-700 gap-2"
                                    onClick={() => setPreviewSize("tablet")}
                                >
                                    <UilTablet className="w-6 h-6 text-gray-600" /> <span className="justify-between items-center flex grow-1 w-full"> Tablet <span className='text-xs text-gray-400'>768px</span></span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className="flex items-center text-sm text-gray-700 gap-2"
                                    onClick={() => setPreviewSize("mobile")}
                                >
                                    <UilMobileAndroidAlt className="w-6 h-6 text-gray-600" /> <span className="justify-between items-center flex w-full">Mobile <span className='text-xs text-gray-400'>420px</span></span>
                                </Dropdown.Item>
                            </Dropdown>
                        }
                        {/* <!-- light/dark mode--> */}
                        <Button
                            color={"light"}
                            size="xs"
                            disabled={!showPreview}
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? <UilMoon className="w-6 h-6 text-gray-600" /> : <UilSun className="w-6 h-6 text-gray-600" />}

                        </Button>
                        {/* <!-- more menu dropdown --> */}
                        <Button
                            color={"light"}
                            size="xs"
                            disabled={!showPreview}
                        >
                            <UilEllipsisH className="w-6 h-6 text-gray-600" />
                        </Button>
                        {/* <!-- sidebar show hide --> */}
                        <span className='w-[2px] rounded bg-gray-200 h-[80%]'></span>
                        <Button
                            color={"light"}
                            size="xs"
                            onClick={() => setShowSideBar(!showSideBar)}
                            disabled={!showPreview}
                        >
                            {showSideBar ? <UilWindowGrid className="w-6 h-6 text-gray-600" /> : <UilBorderRight className="w-6 h-6 text-gray-600" />}
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default MainMenu;