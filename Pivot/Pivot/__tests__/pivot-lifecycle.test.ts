import { Pivot } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { ItemColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { ContextEx } from '../ContextExtended';
import { mount } from 'enzyme';
import * as ReactTestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

const runAllTimers = () =>
    ReactTestUtils.act(() => {
        jest.runAllTimers();
    });

describe('Pivot', () => {
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

    it('raises the onSelect event', () => {
        const { component, context, notifyOutputChanged } = createComponent();

        component.init(context, notifyOutputChanged);
        const pivotElement = component.updateView(context);

        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;

        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);

        const pivot = mount(pivotElement);

        const menuItem = pivot.find('button.ms-Button').first();
        expect(menuItem.length).toEqual(1);
        menuItem.simulate('click');

        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(firstCommandReference);

        expect(notifyOutputChanged).toBeCalledTimes(1);
        const output = component.getOutputs();
        expect(output.SelectedKey).toBe('item1');
    });

    it('keeps the Selected property in sync with SelectedKey', () => {
        const { component, context, notifyOutputChanged } = createComponent();

        // Mock the entity references
        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;
        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);
        const secondCommandReference = {
            id: { guid: '2' },
            name: '2',
        } as ComponentFramework.EntityReference;
        context.parameters.items.records['2'].getNamedReference = jest.fn().mockReturnValueOnce(secondCommandReference);

        component.init(context, notifyOutputChanged);
        // Set the default selected key
        context.parameters.SelectedKey.raw = 'item2';
        context.updatedProperties = ['SelectedKey'];
        component.updateView(context);

        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(secondCommandReference);

        // OnChange should not be called when the input SelectedKey changes
        expect(notifyOutputChanged).toBeCalledTimes(0);

        context.parameters.items.openDatasetItem = jest.fn();

        // Set the default selected key again
        context.parameters.SelectedKey.raw = 'item1';
        context.updatedProperties = ['SelectedKey'];
        component.updateView(context);

        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(firstCommandReference);

        // OnChange should not be called when the input SelectedKey changes
        expect(notifyOutputChanged).toBeCalledTimes(0);
    });

    it('sets focus on control', () => {
        expect.assertions(1);
        const { component, context, notifyOutputChanged, container } = createComponent();

        ReactTestUtils.act(() => {
            component.init(context, notifyOutputChanged);
            ReactDOM.render(component.updateView(context), container);
        });

        context.parameters.InputEvent.raw = 'SetFocus' + Math.random().toString();

        ReactTestUtils.act(() => {
            ReactDOM.render(component.updateView(context), container);
            const buttons = container.getElementsByTagName('BUTTON');
            // Set buttons visible for tests
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (buttons.item(0) as any).isVisible = true;
        });

        runAllTimers();

        expect(document.activeElement?.tagName).toBe('BUTTON');

        ReactDOM.unmountComponentAtNode(container);
    });

    it('does not cause duplicate key warnings if the ItemKey is duplicated', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();

        context.parameters.items = new MockDataSet([
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'New',
            }),
        ]);
        component.init(context, notifyOutputChanged);

        // Check there is no duplicate key message
        mount(component.updateView(context));

        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('theme', async () => {
        const { component, context, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#test-primary',
            },
        });

        component.init(context, notifyOutputChanged);
        const themedPivot = renderer.create(component.updateView(context));
        expect(themedPivot.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new Pivot();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    context.parameters.RenderType.raw = '1'; // Pivot
    context.parameters.items = new MockDataSet([
        new MockEntityRecord('1', {
            [ItemColumns.DisplayName]: 'Item 1',
            [ItemColumns.Key]: 'item1',
            [ItemColumns.IconName]: 'Open',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: true,
            [ItemColumns.IconOnly]: false,
        }),
        new MockEntityRecord('2', {
            [ItemColumns.DisplayName]: 'Item 2',
            [ItemColumns.Key]: 'item2',
            [ItemColumns.IconName]: 'New',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: false,
            [ItemColumns.IconOnly]: true,
        }),
    ]);
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
