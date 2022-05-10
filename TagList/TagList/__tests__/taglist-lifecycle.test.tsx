/* eslint-disable sonarjs/no-identical-functions */
import { mount } from 'enzyme';
import { TagList } from '..';
import { ContextEx } from '../ContextExtended';
import { IInputs } from '../generated/ManifestTypes';
import { ItemColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('CommandBar', () => {
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
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('renders dummy items when no items configured', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        // Simulate there being no items bound - which causes an error on the parameters
        context.parameters.items.error = true;
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('does not cause duplicate key warnings if the ItemKey is duplicated', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();

        context.parameters.items = new MockDataSet([
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Tag 1',
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Tag 2',
            }),
        ]);
        component.init(context, notifyOutputChanged);

        // Check there is no duplicate key message
        mount(component.updateView(context));

        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});

function createComponent() {
    const component = new TagList();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    const items = [
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.DisplayName]: 'Tag 1',
            [ItemColumns.IconName]: 'Open',
            [ItemColumns.IconColor]: 'blue',
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'item2',
            [ItemColumns.DisplayName]: 'Tag 2',
            [ItemColumns.IconName]: 'New',
            [ItemColumns.IconColor]: 'blue',
        }),
        new MockEntityRecord('3', {
            [ItemColumns.Key]: 'item3',
            [ItemColumns.DisplayName]: 'Tag 3',
            [ItemColumns.IconName]: 'Save',
            [ItemColumns.IconColor]: 'green',
        }),
    ];
    context.parameters.items = new MockDataSet(items);
    const state = new MockState();
    return { component, context, notifyOutputChanged, state };
}
