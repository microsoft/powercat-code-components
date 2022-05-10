import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { TagListItem, CanvasTagListProps } from '../components/Component.types';
import { CanvasTagList } from '../components/CanvasTagList';
import { Tag } from '../components/Tag';

const mutationObserverMock = jest.fn<MutationObserver, [MutationCallback]>().mockImplementation(() => {
    return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn(),
    };
});

const defaultProps = {
    items: [
        {
            id: '1',
            key: '1',
            name: 'tag1',
        },
    ] as TagListItem[],
    onSelected: jest.fn(),
} as CanvasTagListProps;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).MutationObserver = mutationObserverMock;

describe('TagList', () => {
    beforeEach(() => jest.clearAllMocks());

    it('tag renders correctly with no style', async () => {
        expect.assertions(1);
        const component = renderer.create(<Tag index={1} item={defaultProps.items[0]} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('taglist renders correctly with no style', async () => {
        expect.assertions(1);
        const component = renderer.create(<CanvasTagList {...defaultProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
