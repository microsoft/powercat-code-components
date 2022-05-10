import { Nav } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { ItemColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { ContextEx } from '../ContextExtended';
import { mount } from 'enzyme';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('Nav', () => {
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
        // First time, the SelectedKey updated property is not set by Canvas Apps
        context.updatedProperties = [];
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

    it('collpase by default', () => {
        const { component, context, notifyOutputChanged } = createComponent();

        component.init(context, notifyOutputChanged);
        context.parameters.CollapseByDefault.raw = false;
        const navLinksElements = component.updateView(context);
        const navLinks = mount(navLinksElements);
        const navLinkNodes = navLinks.find('.ms-Nav-chevronButton').first();
        expect(navLinkNodes.getDOMNode().getAttribute('aria-expanded')).toEqual('true');
    });

    it('individual navlink expand-collapse', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        context.parameters.CollapseByDefault.raw = false;
        const navLinksElements = component.updateView(context);
        const navLinks = mount(navLinksElements);
        const navLinkNodes = navLinks.find('.ms-Nav-chevronButton');
        expect(navLinkNodes.length).toEqual(3);
        expect(navLinkNodes.last().getDOMNode().getAttribute('aria-expanded')).toEqual('true');
    });

    it('does not cause duplicate key warnings if the ItemKey is duplicated', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();

        context.parameters.items = new MockDataSet([
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Item 1',
                [ItemColumns.Expanded]: true,
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'item2',
                [ItemColumns.DisplayName]: 'Item 2',
                [ItemColumns.ParentKey]: 'item1',
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Item 3',
                [ItemColumns.ParentKey]: 'item1',
                [ItemColumns.Expanded]: true,
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
        const themedNav = renderer.create(component.updateView(context));
        expect(themedNav.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new Nav();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    context.parameters.items = new MockDataSet([
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.DisplayName]: 'Item 1',
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'item2',
            [ItemColumns.DisplayName]: 'Item 2',
            [ItemColumns.ParentKey]: 'item1',
        }),
        new MockEntityRecord('3', {
            [ItemColumns.Key]: 'item3',
            [ItemColumns.DisplayName]: 'Item 3',
            [ItemColumns.ParentKey]: 'item1',
        }),
        new MockEntityRecord('4', {
            [ItemColumns.Key]: 'item4',
            [ItemColumns.DisplayName]: 'Item 4',
            [ItemColumns.Expanded]: true,
        }),
        new MockEntityRecord('5', {
            [ItemColumns.Key]: 'item5',
            [ItemColumns.DisplayName]: 'Item 5',
            [ItemColumns.ParentKey]: 'item4',
        }),
        new MockEntityRecord('6', {
            [ItemColumns.Key]: 'item6',
            [ItemColumns.DisplayName]: 'Item 6',
            [ItemColumns.Expanded]: true,
        }),
        new MockEntityRecord('7', {
            [ItemColumns.Key]: 'item7',
            [ItemColumns.DisplayName]: 'Item 7',
            [ItemColumns.ParentKey]: 'item6',
        }),
    ]);
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
