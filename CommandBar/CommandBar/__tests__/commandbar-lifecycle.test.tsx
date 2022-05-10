/* eslint-disable sonarjs/no-identical-functions */
import { mount } from 'enzyme';
import ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import { CommandBar } from '..';
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

const runAllTimers = () =>
    ReactTestUtils.act(() => {
        jest.runAllTimers();
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
        const { component, context } = createComponent();
        component.init(context);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('renders dummy items when no items configured', () => {
        const { component, context } = createComponent();
        // Simulate there being no items bound - which causes an error on the parameters
        context.parameters.items.error = true;
        component.init(context);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('raises the onSelect event', () => {
        const { component, context } = createComponent();
        component.init(context);
        const commandBarElement = component.updateView(context);

        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;
        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);

        const commandBar = mount(commandBarElement);
        const menuItem = commandBar.find('button.ms-Button').first();
        expect(menuItem.length).toEqual(1);
        menuItem.simulate('click');
        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(firstCommandReference);
    });

    it('renders subitems and shows the flyout menu', () => {
        const { component, context } = createComponent(true);

        component.init(context);
        const commandBarElement = component.updateView(context);
        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;
        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);

        // The sub items should not be included in the root commands
        expect(commandBarElement).toMatchSnapshot();

        const commandBar = mount(commandBarElement);
        const menuItem = commandBar.find('button.ms-Button').first();
        expect(menuItem.length).toEqual(1);

        menuItem.simulate('click');

        const subItem = document.querySelector('.ms-ContextualMenu-itemText');
        expect(subItem).toBeDefined();
        expect(subItem?.childNodes[0].textContent).toBe('Sub 1');
    });

    it('sets focus on control', () => {
        expect.assertions(1);
        const { component, context, container } = createComponent();

        ReactTestUtils.act(() => {
            component.init(context);
            ReactDOM.render(component.updateView(context), container);
        });

        context.parameters.InputEvent.raw = 'SetFocus' + Math.random().toString();

        ReactTestUtils.act(() => {
            ReactDOM.render(component.updateView(context), container);
        });

        runAllTimers();

        expect(document.activeElement?.tagName).toBe('BUTTON');

        ReactDOM.unmountComponentAtNode(container);
    });

    it('does not cause duplicate key warnings if the ItemKey is duplicated', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context } = createComponent();

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
        component.init(context);

        // Check there is no duplicate key message
        mount(component.updateView(context));

        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});

function createComponent(subCommands?: boolean) {
    const component = new CommandBar();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    const items = [
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'commandOpen',
            [ItemColumns.DisplayName]: 'Open',
            [ItemColumns.IconName]: 'Open',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: true,
            [ItemColumns.IconOnly]: false,
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'commandNew',
            [ItemColumns.DisplayName]: 'New',
            [ItemColumns.IconName]: 'New',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: false,
            [ItemColumns.IconOnly]: true,
        }),
        new MockEntityRecord('3', {
            [ItemColumns.Key]: 'commandSave',
            [ItemColumns.DisplayName]: 'Save',
            [ItemColumns.IconName]: 'Save',
            [ItemColumns.IconColor]: 'green',
            [ItemColumns.Enabled]: false,
            [ItemColumns.IconOnly]: true,
            [ItemColumns.FarItem]: true,
        }),
    ];
    if (subCommands) {
        items.push(
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'sub1',
                [ItemColumns.DisplayName]: 'Sub 1',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.ParentKey]: 'commandOpen',
            }),
        );
        items.push(
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'sub2',
                [ItemColumns.DisplayName]: 'Sub 2',
                [ItemColumns.IconName]: 'Save',
                [ItemColumns.ParentKey]: 'commandOpen',
            }),
        );
    }
    context.parameters.items = new MockDataSet(items);
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, container, notifyOutputChanged, state };
}
