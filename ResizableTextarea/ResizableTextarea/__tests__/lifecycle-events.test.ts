import { ResizableTextarea } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { ResizeObserverMock } from "../__mocks__/resize-observer-polyfill";

const LIPSUM = "Lorem Ipsum";
const LIPSUM_EDIT = "Lorem Ipsum Edit";

describe("ResizeableTextArea lifecycle events", () => {
  beforeEach(() => jest.clearAllMocks());
  it("initialises ResizeObserver on init, and disconnects on destroy", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    component.init(context, notifyOutputChanged, state, container);
    expect(ResizeObserverMock.observe).toHaveBeenCalledTimes(1);

    component.destroy();
    expect(ResizeObserverMock.disconnect).toHaveBeenCalledTimes(1);
  });

  it("does not call notifyOutputChanged inside init", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    component.init(context, notifyOutputChanged, state, container);
    // Check that the notify event has not been called
    expect(notifyOutputChanged).toHaveBeenCalledTimes(0);
  });

  it("creates the textarea element wrapped in containers with text value", () => {
    const textValue = LIPSUM;
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);

    expect(container).toMatchSnapshot("Container after init");
    expect(container.getElementsByTagName("textarea")[0].value).toBe(textValue);
  });

  it("creates the textarea element wrapped in containers with default value", () => {
    const textValue = LIPSUM;
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Default.raw = textValue;
    context.parameters.Text.raw = "foo";
    component.init(context, notifyOutputChanged, state, container);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(textValue);
  });

  it("updates textarea value when host provides updated text", () => {
    const textValue = LIPSUM;
    const newTextValue = LIPSUM_EDIT;
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);

    // Set the new text value and set the updateProperties
    context.parameters.Text.raw = newTextValue;
    context.updatedProperties = ["Text", "Parameters"];
    component.updateView(context);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(newTextValue);
  });

  it("updates textarea value when host provides new default", () => {
    const textValue = LIPSUM;
    const newTextValue = LIPSUM_EDIT;
    const newDefaultValue = LIPSUM_EDIT;
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);

    // Set the new text value and set the updateProperties
    context.parameters.Text.raw = newTextValue;
    context.updatedProperties = ["Text", "Parameters"];
    component.updateView(context);

    // Set the new Default value and set the updateProperties
    context.parameters.Default.raw = newDefaultValue;
    context.updatedProperties = ["Default", "Parameters"];
    component.updateView(context);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(newDefaultValue);
  });

  it("updates font styles", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    component.init(context, notifyOutputChanged, state, container);

    expect(container).toMatchSnapshot();

    // Set the new Default value and set the updateProperties
    context.parameters.FontSize.raw = 10;
    component.updateView(context);
    expect(container).toMatchSnapshot("Container after FontSize update");
  });

  it("updates FontSize", () => {
    const textValue = "Lorem Ipsum";

    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);
    context.parameters.FontSize.raw = 10;
    expect(container).toMatchSnapshot("initial");

    // Set the new Default value and set the updateProperties
    context.parameters.FontSize.raw = 20;
    component.updateView(context);
    expect(container).toMatchSnapshot("after fontsize update");
  });

  it("sets positive tabindex for canvas apps", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context as any).accessibility = { assignedTabIndex: 15 };
    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot();
  });

  it("resets text to default when ResetText event is provided", () => {
    const newTextValue = LIPSUM_EDIT;
    const defaultValue = LIPSUM;
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Default.raw = defaultValue;
    component.init(context, notifyOutputChanged, state, container);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(defaultValue);

    // Set the new text value and set the updateProperties
    context.parameters.Text.raw = newTextValue;
    context.updatedProperties = ["Text", "Parameters"];
    component.updateView(context);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(newTextValue);

    // Set the new Default value and set the updateProperties
    context.parameters.InputEvent.raw = "ResetText_123";
    context.updatedProperties = ["Default", "Parameters"];
    component.updateView(context);
    expect(container.getElementsByTagName("textarea")[0].value).toBe(defaultValue);
  });
});

function createComponent() {
  const component = new ResizableTextarea();
  const notifyOutputChanged = jest.fn();
  const context = new MockContext<IInputs>(getMockParameters());
  const state = new MockState();
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { component, context, notifyOutputChanged, state, container };
}
