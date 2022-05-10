/* eslint-disable sonarjs/no-identical-functions */

import { IBasePicker, ITag } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import { TagPickerComponentProps, TagPickerComponent } from '../TagPickerComponent';
import { MockResources } from '../__mocks__/mock-context';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

const runAllTimers = () =>
    ReactTestUtils.act(() => {
        jest.runAllTimers();
    });

const defaultProps = {
    width: 300,
    height: 32,
    tags: [] as ITag[],
    tabIndex: 1,
    minumumFilterLength: 0,
    keepTypingMessage: null,
    noSuggestionsMessage: null,
    maxTags: undefined,
    tagMaxWidth: null,
    disabled: false,
    onResize: undefined,
    error: false,
    fontSize: undefined,
    borderRadius: undefined,
    itemHeight: undefined,
    allowFreeText: undefined,
    themeJSON: undefined,
    hintText: undefined,
} as TagPickerComponentProps;

describe('TagPickerComponent', () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === 'DIV') {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
    });

    it('shows suggestions', () => {
        jest.useFakeTimers();
        const root = document.createElement('div');
        document.body.appendChild(root);
        const pickerRef = React.createRef<IBasePicker<ITag>>();
        const onAdd = jest.fn();
        const onRemove = jest.fn();
        const onFilter = jest.fn();
        const props = {
            ...defaultProps,
            onAdd: onAdd,
            onRemove: onRemove,
            filterSuggestions: onFilter,
            componentRef: pickerRef,
            resources: MockResources,
        } as TagPickerComponentProps;

        ReactDOM.render(<TagPickerComponent {...props} />, root);

        onFilter.mockImplementation((filter: string) => {
            if (filter === 'red') {
                return [
                    {
                        name: 'red',
                        key: 'red',
                    },
                ];
            }
            return [];
        });
        const input = document.querySelector('.ms-BasePicker-input') as HTMLInputElement;
        input.focus();
        input.value = 'red';

        ReactTestUtils.Simulate.input(input);
        runAllTimers();
        expect(onFilter).toBeCalledWith('red');

        // Get suggestion button
        const suggestion = document.querySelector('.ms-Suggestions-itemButton') as HTMLInputElement;
        expect(suggestion).toBeDefined();

        // Select suggestion
        ReactTestUtils.Simulate.click(suggestion);
        runAllTimers();

        // Check add is called with suggestion
        expect(onAdd).toBeCalledTimes(1);
        expect(onAdd).toBeCalledWith(expect.objectContaining({ key: 'red', name: 'red' }));

        props.tags = [
            {
                name: 'red',
                key: 'red',
            },
        ];
        ReactDOM.render(<TagPickerComponent {...props} />, root);

        // Check 1 tag
        expect(pickerRef.current?.items).toHaveLength(1);

        ReactDOM.unmountComponentAtNode(root);
    });
});
