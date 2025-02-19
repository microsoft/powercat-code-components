
import { FluentMessageBar } from '..';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { IInputs, IOutputs } from '../generated/ManifestTypes';
import { ItemColumns } from '../ManifestConstant';

describe('FluentMessageBar', () => {
    let component: FluentMessageBar;
    let context: ComponentFramework.Context<IInputs>;
    let notifyOutputChanged: jest.Mock;
    let container: HTMLDivElement;

    beforeEach(() => {
        notifyOutputChanged = jest.fn();
        container = document.createElement('div');
        component = new FluentMessageBar();
        jest.clearAllMocks();
    });
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === "DIV") {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
    });


    it("renders", () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged, {}, container);
        const messageBarElement = component.updateView(context);
        expect(messageBarElement).toMatchSnapshot();
    });

    it('should update view correctly', async () => {

        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged, {}, container);
        const messageBarElement = component.updateView(context);
        expect(messageBarElement).toMatchSnapshot();

        expect(component['_context']).toBe(context);
        expect(component['notifyOutputChanged']).toBe(notifyOutputChanged);
        expect(component['parentContainer']).toBe(container);

    });

    it('should call OnDismiss event', async () => {
        context = {
            events: {
                OnDismiss: jest.fn()
            },

            mode: {
                trackContainerResize: jest.fn(),
                allocatedHeight: 0,
                allocatedWidth: 0,
                isControlDisabled: false,
                isVisible: false,
                label: ''
            }

        } as unknown as ComponentFramework.Context<IInputs>;
        // Act: Call init and let updateView proceed without mocking
        await component.init(context, notifyOutputChanged, {}, container);
        component.OnDismiss();
        expect(context.events.OnDismiss).toHaveBeenCalled();
    });

    it('should return empty outputs', () => {
        const outputs: IOutputs = component.getOutputs();
        expect(outputs).toEqual({});
    });
    
    it('should return default value if property is empty', () => {
        const defaultValue = 'default';
        const result = component.defaultIfEmpty({
            raw: null,
            error: false,
            errorMessage: '',
            type: ''
        }, defaultValue);
        expect(result).toBe(defaultValue);
    });

    it('should return property value if not empty', () => {
        const value = 'value';
        const result = component.defaultIfEmpty({
            raw: value,
            error: false,
            errorMessage: '',
            type: ''
        }, 'default');
        expect(result).toBe(value);
    });

});


function createComponent() {
    const component = new FluentMessageBar();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.Title.raw = "Title";
    context.parameters.Body.raw = "Body";
    //context.mode.isVisible = true;
    context.parameters.Shape.raw = "square";
    context.parameters.LinkText.raw = "Link";
    context.parameters.URL.raw = "https://google.com";
    context.parameters.Intent.raw = 'info';
    context.parameters.Items = new MockDataSet([
        new MockEntityRecord("1", {
            [ItemColumns.Key]: "toolAdd",
            [ItemColumns.DisplayName]: "Add",
            [ItemColumns.IconName]: "Add",
            [ItemColumns.IconStyle]: "Filled",
            [ItemColumns.Appearance]: "Primary",
            [ItemColumns.Visible]: true,
        }),
        new MockEntityRecord("2", {
            [ItemColumns.Key]: "toolEdit",
            [ItemColumns.DisplayName]: "Edit",
            [ItemColumns.IconName]: "Edit",
            [ItemColumns.IconStyle]: "Regular",
            [ItemColumns.Appearance]: "Subtle",
            [ItemColumns.Visible]: true,
        }),
        new MockEntityRecord("3", {
            [ItemColumns.Key]: "toolDelete",
            [ItemColumns.DisplayName]: "Delete",
            [ItemColumns.IconName]: "Delete",
            [ItemColumns.Disabled]: true,
            [ItemColumns.IconStyle]: "Filled",
            [ItemColumns.Appearance]: "Subtle",
            [ItemColumns.Visible]: true,
        }),
        new MockEntityRecord("4", {
            [ItemColumns.Key]: "toolInfo",
            [ItemColumns.DisplayName]: "Info",
            [ItemColumns.IconName]: "Info",
            [ItemColumns.Disabled]: false,
            [ItemColumns.IconStyle]: "Filled",
            [ItemColumns.Appearance]: "Subtle",
            [ItemColumns.Visible]: false,
        }),
    ]);

    const state = new MockState();
    const container = document.createElement("div");
    document.body.appendChild(container);
    return { component, context, container, notifyOutputChanged, state };
}