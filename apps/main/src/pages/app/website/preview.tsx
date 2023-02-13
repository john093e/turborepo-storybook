import mockResponse from '@lib/dynamic-rendering/dynamic-rendering.mock';
import { createPage } from '@lib/dynamic-rendering';

function Preview() {
    return (
        <div className="my-3">
            <h1 className="display-3">
                Preview
            </h1>
            {createPage(mockResponse)}
        </div>
    );
}

export default Preview;
