import { IBasePicker, IPersonaProps } from '@fluentui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import { CanvasPeoplePicker } from '../components/PeoplePicker';
import { CanvasPeoplePickerProps } from '../components/Component.types';
import { getDataSetfromPersona } from '../components/DatasetMapping';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

const runAllTimers = () =>
    ReactTestUtils.act(() => {
        jest.runAllTimers();
    });

describe('PeoplePickerComponent', () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === 'DIV') {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
    });

    it('test getDataSetfromPersona function', () => {
        const personaValue = [{ key: '1', text: 'John Doe' }] as IPersonaProps[];
        const personaOutput = getDataSetfromPersona(personaValue);
        expect(personaOutput[0].PersonaKey).toBe(personaOutput[0].PersonaKey);
    });

    it('shows suggestions', () => {
        jest.useFakeTimers();
        const root = document.createElement('div');
        document.body.appendChild(root);
        const pickerRef = React.createRef<IBasePicker<IPersonaProps>>();
        const selectedItems = jest.fn();
        const updateSearchTerm = jest.fn();
        const filterSuggestions = jest.fn();
        const onBlur = jest.fn();
        const onFocus = jest.fn();

        const props = {
            width: 300,
            height: 32,
            people: [{ key: '1', text: 'John Doe' }] as IPersonaProps[],
            peoplepickerType: 'Normal',
            defaultSelected: [] as IPersonaProps[],
            delayResults: false,
            isPickerDisabled: false,
            showSecondaryText: false,
            minumumFilterLength: 0,
            disabled: false,
            onResize: undefined,
            componentRef: pickerRef,
            error: false,
            themeJSON: undefined,
            selectedItems: selectedItems,
            suggestedPeople: [] as IPersonaProps[],
            updateSearchTerm: updateSearchTerm,
            minimumFilterLength: 3,
            keepTypingMessage: 'Continue typing...',
            suggestionsHeaderText: 'Suggested People',
            filterSuggestions: filterSuggestions,
            noresultfoundText: 'no result found',
            onBlur: onBlur,
            onFocus: onFocus,
            hintText: 'Search',
            maxPeople: 10,
        } as CanvasPeoplePickerProps;

        ReactDOM.render(<CanvasPeoplePicker {...props} />, root);

        filterSuggestions.mockImplementation((filter: string) => {
            if (filter === 'John') {
                return [
                    {
                        text: 'John Doe',
                        key: '1',
                    },
                ] as IPersonaProps[];
            }
            return [];
        });
        const input = document.querySelector('.ms-BasePicker-input') as HTMLInputElement;
        input.focus();
        input.value = 'John';

        ReactTestUtils.Simulate.input(input);
        runAllTimers();
        expect(filterSuggestions).toBeCalledWith('John');

        // Get suggestion button
        const suggestion = document.querySelector('.ms-Suggestions-itemButton') as HTMLInputElement;
        expect(suggestion).toBeDefined();

        // Select suggestion
        ReactTestUtils.Simulate.click(suggestion);
        runAllTimers();

        // Check selectedItems is called with suggestion
        // To be called twice, initial call for Setting empty defaultSelected value
        expect(selectedItems).toBeCalledTimes(2);
        expect(selectedItems).toBeCalledWith(expect.arrayContaining([{ key: '1', text: 'John Doe' }]));

        props.defaultSelected = [
            {
                text: 'John Doe',
                key: '1',
            },
        ];
        ReactDOM.render(<CanvasPeoplePicker {...props} />, root);
        // Check 1 persona
        expect(pickerRef.current?.items).toHaveLength(1);

        ReactDOM.unmountComponentAtNode(root);
    });
});
