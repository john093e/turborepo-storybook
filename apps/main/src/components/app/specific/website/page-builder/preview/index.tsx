import React, {useState, useEffect} from "react";
import { useContext } from 'react';
import { LayoutContext } from '@contexts/app/specific/website/page-builder/layout';
import PreviewWysiwyg from "./preview-wysiwyg";
import { Button } from "flowbite-react";
import { UilRefresh, UilExternalLinkAlt } from '@iconscout/react-unicons';
import { Resizable } from "re-resizable";

const ResizeHandle = () => {
    return (
        <div
            className={"w-full h-full flex justify-center items-center"}
        >
            <div className=" duration-300 w-1 h-32 bg-gray-200 rounded dark:bg-gray-800 group-hover:bg-gray-400 group-hover:dark:bg-gray-900">
            </div>
        </div>
    );
}


const Preview = () => {
    const {
        previewSize,
    } = useContext(LayoutContext);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if(previewSize === 'tablet') {
            setWidth(768);
        }
        else if( previewSize === 'mobile') {
            setWidth(420);
        }else {
            setWidth(0);
        }
    }, [previewSize]);

    return (
        <div className="bg-gray-100 h-full w-full dark:bg-gray-800 flex justify-center p-6 pb-0 overflow-auto">
            <Resizable
                defaultSize={{ width: "100%", height: "100%" }}
                size={{ width: width === 0 ? "100%" : `${width}px`, height: "100%" }}
                minWidth="320px"
                maxWidth={previewSize === "desktop" ? "100%" : previewSize === "tablet" ? "768px" : previewSize === "mobile" ? "420px" : "100%"}
                minHeight="0"
                maxHeight="100%"
                lockAspectRatio={false}
                bounds={"parent"}
                resizeRatio={2}
                onResize={(e, direction, ref, d) => {
                    const width = ref.offsetWidth;
                    setWidth(width);
                }}
                handleWrapperClass={"w-full"}
                handleClasses={{ left: "!-left-[1em] flex justify-center items-center group", right: "!-right-[1em] flex justify-center items-center group" }}
                boundsByDirection={true}
                handleComponent={{ left: <ResizeHandle />, right: <ResizeHandle /> }}
                enable={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >

                {previewSize === "tablet" ? (
                    <div className="flex justify-end items-center absolute left-0 top-0 -rotate-90 origin-right -translate-x-[10.75em] w-full max-w-[9.75em] text-sm text-gray-300 dark:text-gray-600">
                        Tablet width : {width}px
                    </div>)
                : previewSize === "mobile" ? (
                    <div className="flex justify-end items-center absolute left-0 top-0 -rotate-90 origin-right -translate-x-[10.75em] w-full max-w-[9.75em] text-sm text-gray-300 dark:text-gray-600">
                        Mobile width : {width}px
                    </div>) 
                : null}

                <div className={`relative rounded-md rounded-b-none shadow-lg flex flex-col h-full w-full`} >
                    <div className='flex bg-gray-100 p-0 dark:bg-gray-900 justify-between border-solid border-[1px] border-gray-300 rounded-t-md overflow-hidden'>
                        <div className="flex pl-4 gap-2 items-center">
                            <p className="font-normal text-sm text-gray-600">http://app.localhost:3000/NAME-OFF-THE-PAGE</p>
                            <Button className='inlineButton font-normal text-sm'>
                                Change URL
                            </Button>
                        </div>
                        <div className="flex items-center p-0 justify-end">
                            {/* <!-- reload preview --> */}
                            <Button
                                color={"light"}
                                size="sm"
                                className='rounded-none border-gray-200 border-t-0 border-b-0'
                            >
                                <UilRefresh className="w-5 h-5 text-gray-600" />
                            </Button>
                            {/* <!-- open in a tab browser sidebar --> */}
                            <Button
                                color={"light"}
                                size="sm"
                                className='rounded-none border-gray-200 border-r-0 border-l-0 border-t-0 border-b-0'
                            >
                                <UilExternalLinkAlt className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>
                    </div>
                    <div className='relative flex w-full h-full bg-white border-solid border-[1px] border-gray-300 border-t-0'>
                        <PreviewWysiwyg />
                    </div>
                </div>
            </Resizable>
        </div>
    );
};

export default Preview;
