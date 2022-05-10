/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-identical-functions */
import { mount } from 'enzyme';
import ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import { ContextMenu } from '..';
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

describe('ContextMenu', () => {
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
        expect.assertions(5);

        const { component, context, notifyOutputChanged, container } = createComponent();
        component.init(context, notifyOutputChanged);

        const thirdReference = {
            id: { guid: '3' },
            name: 'Item 3',
        } as ComponentFramework.EntityReference;
        context.parameters.items.records['3'].getNamedReference = jest.fn().mockReturnValueOnce(thirdReference);

        const contextMenuElement = component.updateView(context);

        ReactTestUtils.act(() => {
            ReactDOM.render(contextMenuElement, container);
        });

        const buttonItem = document.querySelector('button.ms-Button') as HTMLButtonElement;

        ReactTestUtils.act(() => {
            // Open menu item
            ReactTestUtils.Simulate.click(buttonItem);
            ReactDOM.render(contextMenuElement, container);
        });

        const contextualLinkClass = 'button.ms-ContextualMenu-link';
        expect(document.querySelector(contextualLinkClass)).toBeTruthy();

        ReactTestUtils.act(() => {
            // Select menu 1st item - disabled
            const contextMenuItem = document.querySelector(contextualLinkClass) as HTMLButtonElement;
            ReactTestUtils.Simulate.click(contextMenuItem);
        });

        // Disabled item, so check no event raised
        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(0);

        ReactTestUtils.act(() => {
            // Select menu 2nd item - not disabled
            const contextMenuItem = document.querySelectorAll(contextualLinkClass)[1] as HTMLButtonElement;
            ReactTestUtils.Simulate.click(contextMenuItem);
        });

        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(thirdReference);
        expect(notifyOutputChanged).toBeCalledTimes(0);

        ReactDOM.unmountComponentAtNode(container);
    });

    it('renders subitems and shows the flyout menu', () => {
        const { component, context, notifyOutputChanged } = createComponent(true);

        component.init(context, notifyOutputChanged);
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
        expect(subItem?.childNodes[0].textContent).toBe('Item 2');
    });

    it('removes duplicate keys in flyout', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent(false);
        // Set duplicate keys
        context.parameters.items = new MockDataSet([
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Item 1',
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'item2',
                [ItemColumns.DisplayName]: 'Item 2',
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'item2',
                [ItemColumns.DisplayName]: 'Item 3',
            }),
        ]);

        component.init(context, notifyOutputChanged);
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

        const subItem = document.querySelector('.ms-ContextualMenu-itemText');
        expect(subItem).toBeDefined();
        expect(subItem?.childNodes[0].textContent).toBe('Item 2');

        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('sets focus on control', () => {
        expect.assertions(1);
        const { component, context, notifyOutputChanged, container } = createComponent();

        ReactTestUtils.act(() => {
            component.init(context, notifyOutputChanged);
            ReactDOM.render(component.updateView(context), container);
        });

        context.parameters.InputEvent.raw = 'SetFocus' + Math.random().toString();
        const commandBarElement = component.updateView(context);

        ReactTestUtils.act(() => {
            ReactDOM.render(commandBarElement, container);
        });

        runAllTimers();

        expect(document.activeElement?.tagName).toBe('BUTTON');
        ReactDOM.unmountComponentAtNode(container);
    });
});

function createComponent(subCommands?: boolean) {
    const component = new ContextMenu();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    const items = [
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.DisplayName]: 'Item 1',
            [ItemColumns.IconName]: 'Open',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: true,
            [ItemColumns.IconOnly]: false,
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'item2',
            [ItemColumns.DisplayName]: 'Item 2',
            [ItemColumns.IconName]: 'New',
            [ItemColumns.IconColor]: 'blue',
            [ItemColumns.Enabled]: false,
            [ItemColumns.IconOnly]: true,
        }),
        new MockEntityRecord('3', {
            [ItemColumns.Key]: 'item3',
            [ItemColumns.DisplayName]: 'Item 3',
            [ItemColumns.IconName]: 'Save',
            [ItemColumns.IconColor]: 'green',
            [ItemColumns.Enabled]: true,
            [ItemColumns.IconOnly]: true,
        }),
    ];
    if (subCommands) {
        items.push(
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'item4',
                [ItemColumns.DisplayName]: 'Sub 1',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.ParentKey]: 'commandOpen',
            }),
        );
        items.push(
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'item5',
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
    return { component, context, notifyOutputChanged, container, state };
}
