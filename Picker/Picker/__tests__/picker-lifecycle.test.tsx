/* eslint-disable sonarjs/no-identical-functions */
import ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import { Picker } from '..';
import { ContextEx } from '../ContextExtended';
import { IInputs, IOutputs } from '../generated/ManifestTypes';
import { ManifestPropertyNames, SuggestionsColumns, TagsColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';
// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

const runAllTimers = () =>
    ReactTestUtils.act(() => {
        jest.runAllTimers();
    });

describe('Picker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === 'DIV') {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
        // reset any jest timers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((setTimeout as any).mock) {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        }
    });

    it('renders', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const picker = renderer.create(component.updateView(context));
        expect(picker.toJSON()).toMatchSnapshot();
    });

    it('renders with simple tags', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const tags = [
            new MockEntityRecord('1', {
                [TagsColumns.TagsKey]: 'red',
                [TagsColumns.TagsDisplayName]: 'red',
            }),
            new MockEntityRecord('2', {
                [TagsColumns.TagsKey]: 'yellow',
                [TagsColumns.TagsDisplayName]: 'yellow',
            }),
            new MockEntityRecord('3', {
                [TagsColumns.TagsKey]: 'green',
                [TagsColumns.TagsDisplayName]: 'green',
            }),
        ];
        context.parameters.Tags = new MockDataSet(tags);
        const picker = renderer.create(component.updateView(context));
        expect(picker.toJSON()).toMatchSnapshot();
    });

    it('renders without duplicate tag key', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const tags = [
            new MockEntityRecord('1', {
                [TagsColumns.TagsKey]: 'red',
                [TagsColumns.TagsDisplayName]: 'red',
            }),
            new MockEntityRecord('2', {
                [TagsColumns.TagsKey]: 'red',
                [TagsColumns.TagsDisplayName]: 'red',
            }),
            new MockEntityRecord('3', {
                [TagsColumns.TagsKey]: 'green',
                [TagsColumns.TagsDisplayName]: 'green',
            }),
        ];
        context.parameters.Tags = new MockDataSet(tags);
        renderer.create(component.updateView(context));
        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('removes duplicate keys in suggestions', async () => {
        jest.spyOn(console, 'error').mockImplementation();

        const { component, context, notifyOutputChanged, container } = createComponent();
        component.init(context, notifyOutputChanged);
        ReactTestUtils.act(() => {
            ReactDOM.render(component.updateView(context), container);
        });

        const items = [
            new MockEntityRecord('1', {
                [SuggestionsColumns.SuggestionKey]: 'red',
                [SuggestionsColumns.SuggestionsDisplayName]: 'red',
            }),
            new MockEntityRecord('2', {
                [SuggestionsColumns.SuggestionKey]: 'red',
                [SuggestionsColumns.SuggestionsDisplayName]: 'red',
            }),
            new MockEntityRecord('3', {
                [SuggestionsColumns.SuggestionKey]: 'red',
                [SuggestionsColumns.SuggestionsDisplayName]: 'red',
            }),
            new MockEntityRecord('4', {
                [SuggestionsColumns.SuggestionKey]: 'green',
                [SuggestionsColumns.SuggestionsDisplayName]: 'green',
            }),
        ];

        const input = document.querySelector('.ms-BasePicker-input') as HTMLInputElement;

        ReactTestUtils.act(() => {
            input.focus();
            input.value = 're';
            ReactTestUtils.Simulate.input(input);
        });

        runAllTimers();

        // Notify output with the search term
        expect(notifyOutputChanged).toBeCalledTimes(1);
        expect(component.getOutputs()).toMatchObject({ SearchTerm: 're' } as Partial<IOutputs>);

        // Suggestion update
        context.parameters.Suggestions = new MockDataSet(items);
        context.updatedProperties = [ManifestPropertyNames.Suggestions_records];
        ReactTestUtils.act(() => {
            ReactDOM.render(component.updateView(context), container);
        });
        runAllTimers();

        // Wait for jest fake async promise to resolve
        await jest.runAllTimers();

        // Check there are 4 suggestions, with no duplicate key error
        const suggestions = document.querySelectorAll<HTMLButtonElement>('.ms-Suggestions-itemButton');
        expect(suggestions).toHaveLength(4);
        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
        ReactDOM.unmountComponentAtNode(container);
    });
});

function createComponent() {
    const component = new Picker();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;

    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
