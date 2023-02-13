import { useContext } from 'react';
import { EditionContext } from '@contexts/app/specific/website/page-builder/edition';
import { createPage } from '@lib/dynamic-rendering';


const PreviewWysiwyg = () => {
    const { pageBody } = useContext(EditionContext);
    return (
        <div className="w-full absolute top-0 left-0 h-full overflow-x-scroll">
            {createPage(pageBody)}
        </div>
    );
}

export default PreviewWysiwyg;
