import { EditionProvider } from '@contexts/app/specific/website/page-builder/edition';
import { LayoutProvider } from '@contexts/app/specific/website/page-builder/layout';
import PageBuilder from '@components/app/specific/website/page-builder/'
const PageBuilderPage = () => {

    return (
        <EditionProvider>
            <LayoutProvider>
                <PageBuilder />
            </LayoutProvider>
        </EditionProvider>
    );
};

export default PageBuilderPage;