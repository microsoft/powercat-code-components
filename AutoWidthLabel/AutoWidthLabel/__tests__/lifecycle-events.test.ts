import { AutoWidthLabel } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { ResizeObserverMock } from "../__mocks__/resize-observer-polyfill";

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

  it("creates the label div element wrapped in a containers", () => {
    const textValue = "Lorem Ipsum";
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);

    expect(container).toMatchSnapshot("Container after init");
    expect((container.getElementsByClassName("cat-label-text")[0] as HTMLDivElement).innerText).toBe(textValue);
  });

  it("updates label value when host provides updated text", () => {
    const textValue = "Lorem Ipsum";
    const newTextValue = "Lorem Ipsum Edit";
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.parameters.Text.raw = textValue;
    component.init(context, notifyOutputChanged, state, container);

    // Set the new text value and set the updateProperties
    context.parameters.Text.raw = newTextValue;
    context.updatedProperties = ["Text", "Parameters"];
    component.updateView(context);
    expect((container.getElementsByClassName("cat-label-text")[0] as HTMLDivElement).innerText).toBe(newTextValue);
  });

  it("sets positive tabindex for canvas apps", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context as any).accessibility = { assignedTabIndex: 15 };
    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot();
  });
});

function createComponent() {
  const component = new AutoWidthLabel();
  const notifyOutputChanged = jest.fn();
  const context = new MockContext<IInputs>(getMockParameters());
  const state = new MockState();
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { component, context, notifyOutputChanged, state, container };
}
